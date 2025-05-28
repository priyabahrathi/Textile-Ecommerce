import React, { useState, useEffect } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./productManage.css";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
} from "@ionic/react";

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    status: string;
    category: string;
    gender: string;
    outfitName: string;
    outfitType: string;
    skinTone: string;
    description: string;
    brand: string;
}

const ProductManage: React.FC = () => {
    // All products fetched from Firebase
    const [products, setProducts] = useState<Product[]>([]);
    // Filtered products after search
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    // Search input
    const [searchTerm, setSearchTerm] = useState("");
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0); // each group = 5 pages

    // Modal and form state
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    // Form fields for add/edit
    const [newProduct, setNewProduct] = useState({
        name: "",
        image: "",
        price: "",
        status: "Available",
        category: "",
        gender: "",
        outfitName: "",
        outfitType: "",
        skinTone: "",
        description: "",
        brand: "",
    });

    const productsPerPage = 5;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        handleSearch();
        setCurrentPage(1); // reset to first page when filtering changes
        setPageGroup(0);
    }, [searchTerm, products]);

    // Fetch all products from Firebase Realtime Database
    const fetchProducts = () => {
        const db = getDatabase();
        const productsRef = ref(db, "products");

        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const productList: Product[] = [];
            for (let id in data) {
                productList.push({ id, ...data[id] });
            }
            setProducts(productList.reverse());
        });
    };

    // Filter products based on search term
    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    // Reset form fields
    const resetForm = () => {
        setNewProduct({
            name: "",
            image: "",
            price: "",
            status: "Available",
            category: "",
            gender: "",
            outfitName: "",
            outfitType: "",
            skinTone: "",
            description: "",
            brand: "",
        });
        setEditingProductId(null);
    };

    // Open modal for adding new product
    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Open modal for editing a product - populate form with product data
    const openEditModal = (product: Product) => {
        setNewProduct({
            name: product.name,
            image: product.image,
            price: product.price.toString(),
            status: product.status,
            category: product.category,
            gender: product.gender,
            outfitName: product.outfitName,
            outfitType: product.outfitType,
            skinTone: product.skinTone,
            description: product.description,
            brand: product.brand,
        });
        setEditingProductId(product.id);
        setShowAddModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    // Upload image and convert to base64 string
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setNewProduct(prev => ({ ...prev, image: base64String }));
        };
        reader.readAsDataURL(file);
    };

    // Add or update product on form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (
            !newProduct.name.trim() ||
            !newProduct.image.trim() ||
            !newProduct.price.trim() ||
            isNaN(Number(newProduct.price)) ||
            !newProduct.category.trim() ||
            !newProduct.gender.trim() ||
            !newProduct.outfitName.trim() ||
            !newProduct.outfitType.trim() ||
            !newProduct.skinTone.trim() ||
            !newProduct.brand.trim() ||
            !newProduct.status.trim()
        ) {
            alert("Please fill all required fields correctly.");
            return;
        }

        const db = getDatabase();
        if (editingProductId) {
            // Update existing product
            const productRef = ref(db, `products/${editingProductId}`);
            update(productRef, {
                name: newProduct.name,
                image: newProduct.image,
                price: Number(newProduct.price),
                status: newProduct.status,
                category: newProduct.category,
                gender: newProduct.gender,
                outfitName: newProduct.outfitName,
                outfitType: newProduct.outfitType,
                skinTone: newProduct.skinTone,
                description: newProduct.description,
                brand: newProduct.brand,
            })
                .then(() => {
                    alert("Product updated successfully");
                    closeModal();
                })
                .catch((error) => alert("Error updating product: " + error.message));
        } else {
            // Add new product
            const productsRef = ref(db, "products");
            push(productsRef, {
                name: newProduct.name,
                image: newProduct.image,
                price: Number(newProduct.price),
                status: newProduct.status,
                category: newProduct.category,
                gender: newProduct.gender,
                outfitName: newProduct.outfitName,
                outfitType: newProduct.outfitType,
                skinTone: newProduct.skinTone,
                description: newProduct.description,
                brand: newProduct.brand,
            })
                .then(() => {
                    alert("Product added successfully");
                    closeModal();
                })
                .catch((error) => alert("Error adding product: " + error.message));
        }
    };

    // Delete product from Firebase
    const handleDelete = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const db = getDatabase();
        const productRef = ref(db, `products/${id}`);
        remove(productRef)
            .then(() => alert("Product deleted successfully"))
            .catch((error) => alert("Error deleting product: " + error.message));
    };

    // CSV export
    const handleDownloadCSV = () => {
        const csvContent = [
            [
                "Product ID",
                "Product Name",
                "Product Image",
                "Price",
                "Status",
                "Category",
                "Gender",
                "Outfit Name",
                "Outfit Type",
                "Skin Tone",
                "Description",
                "Brand",
            ],
            ...filteredProducts.map((p) => [
                p.id,
                p.name,
                p.image,
                p.price,
                p.status,
                p.category,
                p.gender,
                p.outfitName,
                p.outfitType,
                p.skinTone,
                p.description,
                p.brand,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // PDF export
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Product List", 14, 16);

        const tableColumn = [
            "ID",
            "Name",
            "Image URL",
            "Price",
            "Status",
            "Category",
            "Gender",
            "Outfit Name",
            "Outfit Type",
            "Skin Tone",
            "Description",
            "Brand",
        ];

        const tableRows = filteredProducts.map((p) => [
            p.id,
            p.name,
            p.image,
            p.price.toString(),
            p.status,
            p.category,
            p.gender,
            p.outfitName,
            p.outfitType,
            p.skinTone,
            p.description,
            p.brand,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8, cellWidth: "wrap" },
            columnStyles: { 2: { cellWidth: 40 }, 10: { cellWidth: 50 } },
        });

        doc.save("products.pdf");
    };

    // Pagination navigation
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Handle next/prev page group for pagination buttons (groups of 5)
    const handlePageGroupChange = (direction: "next" | "prev") => {
        if (direction === "next" && (pageGroup + 1) * 5 < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * 5 + 6); // jump to first page of next group
        }
        if (direction === "prev" && pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage((pageGroup - 1) * 5 + 1);
        }
    };

    // Calculate displayed products for current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Pages to display in pagination (up to 5 pages per group)
    const pagesToShow = [];
    for (
        let i = pageGroup * 5 + 1;
        i <= Math.min(totalPages, pageGroup * 5 + 5);
        i++
    ) {
        pagesToShow.push(i);
    }

    return (
        <>
            <IonContent fullscreen>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>Product Management</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={openAddModal}>Add Product</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <div className="search-container" style={{ margin: "10px" }}>
                    <input
                        type="search"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "300px", padding: "5px", fontSize: "1rem" }}
                    />
                </div>

                <table className="product-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Serial No</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product ID</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Image</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gender</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Outfit Name</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Outfit Type</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Skin Tone</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Brand</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {indexOfFirstProduct + products.indexOf(product) + 1}
                                </td>   
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.id}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                    ) : (
                                        "No image"
                                    )}
                                </td>

                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${product.price}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.category}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.gender}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.outfitName}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.outfitType}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.skinTone}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.brand}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.status}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    <button onClick={() => openEditModal(product)} style={{ marginRight: "8px" }}>Edit</button>
                                    <button onClick={() => handleDelete(product.id)} style={{ color: "red" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {currentProducts.length === 0 && (
                            <tr>
                                <td colSpan={11} style={{ textAlign: "center", padding: "20px" }}>
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "15px", alignItems: "center" }}>
                    <MdOutlineNavigateBefore
                        onClick={() => handlePageGroupChange("prev")}
                        style={{ cursor: pageGroup === 0 ? "not-allowed" : "pointer", fontSize: "24px", marginRight: "10px" }}
                        color={pageGroup === 0 ? "#ccc" : "#000"}
                    />

                    {pagesToShow.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                                margin: "0 5px",
                                padding: "5px 10px",
                                backgroundColor: currentPage === page ? "#0b62a4" : "#fff",
                                color: currentPage === page ? "#fff" : "#000",
                                border: "1px solid #0b62a4",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <MdOutlineNavigateNext
                        onClick={() => handlePageGroupChange("next")}
                        style={{
                            cursor: (pageGroup + 1) * 5 >= totalPages ? "not-allowed" : "pointer",
                            fontSize: "24px",
                            marginLeft: "10px",
                        }}
                        color={(pageGroup + 1) * 5 >= totalPages ? "#ccc" : "#000"}
                    />
                </div>

                {/* Export Buttons */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button onClick={handleDownloadCSV} style={{ marginRight: "15px" }}>
                        Export CSV
                    </button>
                    <button onClick={exportPDF}>Export PDF</button>
                </div>

                {/* Add/Edit Product Modal */}
                <IonModal isOpen={showAddModal} onDidDismiss={closeModal}>
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle>{editingProductId ? "Edit Product" : "Add Product"}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={closeModal}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <form onSubmit={handleSubmit} style={{ padding: "15px" }}>
                            <IonItem>
                                <IonLabel position="floating">Product Name*</IonLabel>
                                <IonInput
                                    value={newProduct.name}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Price* (number)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={newProduct.price}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Upload Image*</IonLabel>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ marginLeft: "10px" }}
                                    required={!editingProductId}
                                />
                            </IonItem>

                            {newProduct.image && (
                                <div style={{ margin: "10px 0" }}>
                                    <img
                                        src={newProduct.image}
                                        alt="Preview"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                </div>
                            )}

                            <IonItem>
                                <IonLabel position="floating">Category*</IonLabel>
                                <IonInput
                                    value={newProduct.category}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Gender*</IonLabel>
                                <IonSelect
                                    value={newProduct.gender}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, gender: e.detail.value! }))}
                                    required
                                >
                                    <IonSelectOption value="Male">Male</IonSelectOption>
                                    <IonSelectOption value="Female">Female</IonSelectOption>
                                    <IonSelectOption value="Unisex">Unisex</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Outfit Name*</IonLabel>
                                <IonInput
                                    value={newProduct.outfitName}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, outfitName: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Outfit Type*</IonLabel>
                                <IonInput
                                    value={newProduct.outfitType}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, outfitType: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Skin Tone*</IonLabel>
                                <IonInput
                                    value={newProduct.skinTone}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, skinTone: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Brand*</IonLabel>
                                <IonInput
                                    value={newProduct.brand}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, brand: e.detail.value! }))}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Status*</IonLabel>
                                <IonSelect
                                    value={newProduct.status}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, status: e.detail.value! }))}
                                    required
                                >
                                    <IonSelectOption value="Available">Available</IonSelectOption>
                                    <IonSelectOption value="Out of Stock">Out of Stock</IonSelectOption>
                                    <IonSelectOption value="Discontinued">Discontinued</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Description</IonLabel>
                                <IonInput
                                    value={newProduct.description}
                                    onIonChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.detail.value! }))}
                                />
                            </IonItem>

                            <IonButton expand="block" type="submit" style={{ marginTop: "20px" }}>
                                {editingProductId ? "Update Product" : "Add Product"}
                            </IonButton>
                        </form>
                    </IonContent>
                </IonModal>
            </IonContent>
        </>
    );
};

export default ProductManage;
