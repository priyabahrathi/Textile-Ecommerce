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
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

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
    skinTone: string[];
    description: string;
    brand: string;
    fabricType: string; // ✅ Add this
    color: string;
}

const ProductManage: React.FC = () => {
    // All products fetched from Firebase
    const [products, setProducts] = useState<Product[]>([]);
    // Filtered products after search and filter selections
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    // Search input
    const [searchTerm, setSearchTerm] = useState("");
    // New: Filter states
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0); // each group = 5 pages

    // Modal and form state
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    // Form fields for add/edit
const [newProduct, setNewProduct] = useState<
  Omit<Product, 'id' | 'price' | 'status' | 'category' | 'gender' | 'outfitType' | 'skinTone' | 'fabricType' | 'color'> & {
    price: string;
    status: string;
    category: string;
    gender: string;
    outfitType: string;
    skinTone: string[];   // array
    fabricType: string; // array
    color: string;      // array
  }
>({
  name: "",
  image: "",
  price: "",
  status: "Available",
  category: "",
  gender: "",
  outfitName: "",
  outfitType: "",
  skinTone: [],      // empty array
  description: "",
  brand: "",
  fabricType: '',    // empty array
  color: '',         // empty array
});

    const productsPerPage = 5;
    // Calculate total pages based on filtered products
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Fetch all products from Firebase Realtime Database
    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, "products");

        // Listen for real-time changes in the 'products' node
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const productList: Product[] = [];
            // Iterate through the data and push products to the list
            for (let id in data) {
                productList.push({ id, ...data[id] });
            }
            // Reverse the list to show newest products first
            setProducts(productList.reverse());
        });

        // Cleanup function to unsubscribe from Firebase listener when component unmounts
        return () => unsubscribe();
    }, []);

    // Apply filters and search whenever dependencies change
    useEffect(() => {
        applyFiltersAndSearch();
        setCurrentPage(1); // reset to first page when filters change
        setPageGroup(0); // reset page group
    }, [searchTerm, filterStatus, filterCategory, products]); // Added filterStatus, filterCategory to dependencies

    // Function to apply all filters and search term
    const applyFiltersAndSearch = () => {
        let tempFilteredProducts = products;

        // Apply search term filter
        if (searchTerm.trim() !== "") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus !== "All") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.status === filterStatus
            );
        }

        // Apply category filter
        if (filterCategory !== "All") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.category === filterCategory
            );
        }

        setFilteredProducts(tempFilteredProducts);
    };

    // Reset form fields
    const resetForm = () => {
        setNewProduct({
            name: '',
            price: '',
            image: '',
            category: '',
            gender: '',
            outfitName: '',
            outfitType: '',
            skinTone: [],
            fabricType: '', // ✅ Add this
            color: '',
            brand: '',
            status: '',
            description: '',
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
            skinTone: product.skinTone ? [...product.skinTone] : [],
            description: product.description,
            brand: product.brand,
            fabricType: product.fabricType, // ✅ Add this
            color: product.color,
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
            !newProduct.skinTone.length ||
            !newProduct.brand.trim() ||
            !newProduct.status.trim() ||
            !newProduct.description.trim() // Ensure description is also validated
        ) {
            // Using console.error instead of window.alert as per instructions
            console.error("Please fill all required fields correctly.");
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
                    console.log("Product updated successfully");
                    // In a real app, you'd show a user-friendly success message here
                    closeModal();
                })
                .catch((error) => console.error("Error updating product: " + error.message));
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
                    console.log("Product added successfully");
                    // In a real app, you'd show a user-friendly success message here
                    closeModal();
                })
                .catch((error) => console.error("Error adding product: " + error.message));
        }
    };

    // Delete product from Firebase
    const handleDelete = (id: string) => {
        // Replaced window.confirm with console.log as per instructions.
        // For a live app, implement a custom Ionic modal for confirmation.
        console.log("Delete confirmation for product ID:", id);
        const isConfirmed = window.confirm("Are you sure you want to delete this product?"); // Temporary: Replace with custom modal
        if (!isConfirmed) return;

        const db = getDatabase();
        const productRef = ref(db, `products/${id}`);
        remove(productRef)
            .then(() => console.log("Product deleted successfully"))
            .catch((error) => console.error("Error deleting product: " + error.message));
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
    // Ensure totalPages is a non-negative number before loop
    const safeTotalPages = Math.max(0, totalPages);
    for (
        let i = pageGroup * 5 + 1;
        i <= Math.min(safeTotalPages, pageGroup * 5 + 5);
        i++
    ) {
        pagesToShow.push(i);
    }

    // Extract unique categories for filter dropdown
    const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];

    return (
        <>
            <div className="product-manage-container">
                <div className="product-header-wrapper">
                    <div className="manageProduct-header">
                        <h3>Product Management</h3>
                        <IonButtons slot="end">
                            <IonButton onClick={openAddModal} className="product-add-button"> {/* Added class name */}
                                Add Product
                            </IonButton>
                        </IonButtons>
                    </div>
                </div>

                <div className="search-container">
                    <input
                        type="search"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Serial No</th>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={product.id}>
                                {/* Updated Serial No calculation for current page */}
                                <td>{indexOfFirstProduct + index + 1}</td>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.status}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => openEditModal(product)}>
                                        <FaRegEdit />
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                                        <RiDeleteBinLine />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="no-products">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="product-footer">
                    <div className="total-products">Total Products: {filteredProducts.length}</div>

                    <div className="pagination-wrapper">
                        <MdOutlineNavigateBefore
                            onClick={() => handlePageGroupChange("prev")}
                            className={`pagination-arrow ${pageGroup === 0 ? "disabled" : ""}`}
                        />
                        {pagesToShow.map((page) => (
                            <button
                                className={`pagination-button ${currentPage === page ? "active" : ""}`}
                                key={page}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <MdOutlineNavigateNext
                            onClick={() => handlePageGroupChange("next")}
                            className={`pagination-arrow ${(pageGroup + 1) * 5 >= totalPages ? "disabled" : ""}`}
                        />
                    </div>

                    <div className="export-buttons">
                        <button className="btn-export" onClick={handleDownloadCSV}>
                            Export CSV
                        </button>
                        <button className="btn-export" onClick={exportPDF}>
                            Export PDF
                        </button>
                    </div>
                </div>

                <IonModal isOpen={showAddModal} onDidDismiss={closeModal} className="product-modal">
                    <IonHeader className="product-modal-header">
                        <IonToolbar className="product-modal-toolbar">
                            <IonTitle className="product-modal-title">{editingProductId ? "Edit Product" : "Add Product"}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={closeModal} className="product-modal-close-button">Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="product-modal-content">
                        <form onSubmit={handleSubmit} className="product-form">
                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Product Name*</IonLabel>
                                <IonInput value={newProduct.name} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.detail.value! }))} required className="product-form-input" />
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Price* (number)</IonLabel>
                                <IonInput type="number" value={newProduct.price} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.detail.value! }))} required className="product-form-input" />
                            </IonItem>

                            <div className="image-upload">
                                <label className="upload-label">Upload Image*</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} required={!editingProductId} />
                            </div>

                            {newProduct.image && (
                                <div className="preview-image">
                                    <img src={newProduct.image} alt="Preview" />
                                </div>
                            )}

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Category*</IonLabel>
                                <IonSelect value={newProduct.category} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Formals">Formals</IonSelectOption>
                                    <IonSelectOption value="Casuals">Casuals</IonSelectOption>
                                    <IonSelectOption value="Occasions">Occasions</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Gender*</IonLabel>
                                <IonSelect value={newProduct.gender} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, gender: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Male">Male</IonSelectOption>
                                    <IonSelectOption value="Female">Female</IonSelectOption>
                                    <IonSelectOption value="Unisex">Unisex</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Outfit Name*</IonLabel>
                                <IonInput value={newProduct.outfitName} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, outfitName: e.detail.value! }))} required className="product-form-input" />
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Outfit Type*</IonLabel>
                                <IonSelect value={newProduct.outfitType} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, outfitType: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Top">Top</IonSelectOption>
                                    <IonSelectOption value="Bottom">Bottom</IonSelectOption>
                                    <IonSelectOption value="One-piece">One-piece</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel className="product-form-label">Skin Tone*</IonLabel>
                                <IonSelect
                                    multiple={true}
                                    value={newProduct.skinTone}
                                    onIonChange={(e) => setNewProduct(prev => ({
                                        ...prev,
                                        skinTone: e.detail.value
                                    }))}
                                >
                                    <IonSelectOption value="Fair skin">Fair skin</IonSelectOption>
                                    <IonSelectOption value="Dusky skin">Dusky skin</IonSelectOption>
                                    <IonSelectOption value="Dark skin">Dark skin</IonSelectOption>
                                </IonSelect>

                            </IonItem>


                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Fabric Type*</IonLabel>
                                <IonSelect value={newProduct.fabricType} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, fabricType: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Cotton">Cotton</IonSelectOption>
                                    <IonSelectOption value="Silk">Silk</IonSelectOption>
                                    <IonSelectOption value="Linen">Linen</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Color*</IonLabel>
                                <IonSelect value={newProduct.color} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, color: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Pink">Pink</IonSelectOption>
                                    <IonSelectOption value="White">White</IonSelectOption>
                                    <IonSelectOption value="Yellow">Yellow</IonSelectOption>
                                    <IonSelectOption value="Red">Red</IonSelectOption>
                                    <IonSelectOption value="Green">Green</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Brand*</IonLabel>
                                <IonInput value={newProduct.brand} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, brand: e.detail.value! }))} required className="product-form-input" />
                            </IonItem>

                            <IonItem className="product-form-item">
                                <IonLabel position="floating" className="product-form-label">Status*</IonLabel>
                                <IonSelect value={newProduct.status} onIonChange={(e) => setNewProduct((prev) => ({ ...prev, status: e.detail.value! }))} required className="product-form-select">
                                    <IonSelectOption value="Available">Available</IonSelectOption>
                                    <IonSelectOption value="Out of Stock">Out of Stock</IonSelectOption>
                                    <IonSelectOption value="Discontinued">Discontinued</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonButton expand="block" type="submit" className="submit-button">
                                {editingProductId ? "Update Product" : "Add Product"}
                            </IonButton>
                        </form>
                    </IonContent>
                </IonModal>

            </div>
        </>
    );
};

export default ProductManage;
