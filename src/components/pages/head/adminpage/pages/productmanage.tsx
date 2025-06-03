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
    img: string;
    price: number;
    status: string;
    category: string;
    gender: string;
    outfitName: string;
    outfitType: string;
    skinTone: string[];
    description: string;
    brand: string;
    fabricType: string;
    color: string;
}

interface NewProductState extends Omit<Product, 'id' | 'price'> {
    price: string;
}

const ProductManage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<NewProductState>({
        name: "",
        img: "",
        price: "",
        status: "Available",
        category: "",
        gender: "",
        outfitName: "",
        outfitType: "",
        skinTone: [],
        description: "",
        brand: "",
        fabricType: '',
        color: '',
    });

    // PDF Export Filter States
    const [pdfExportFilter, setPdfExportFilter] = useState<'all' | 'category' | 'status'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const productsPerPage = 5;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, "products");
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const productList: Product[] = [];
            for (let id in data) {
                productList.push({
                    id,
                    ...data[id],
                    price: Number(data[id].price),
                    skinTone: data[id].skinTone || [],
                });
            }
            setProducts(productList.reverse());
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        applyFiltersAndSearch();
        setCurrentPage(1);
        setPageGroup(0);
    }, [searchTerm, filterStatus, filterCategory, products]);

    const applyFiltersAndSearch = () => {
        let tempFilteredProducts = products;
        if (searchTerm.trim() !== "") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== "All") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.status === filterStatus
            );
        }
        if (filterCategory !== "All") {
            tempFilteredProducts = tempFilteredProducts.filter((product) =>
                product.category === filterCategory
            );
        }
        setFilteredProducts(tempFilteredProducts);
    };

    const resetForm = () => {
        setNewProduct({
            name: '',
            price: '',
            img: '',
            category: '',
            gender: '',
            outfitName: '',
            outfitType: '',
            skinTone: [],
            fabricType: '',
            color: '',
            brand: '',
            status: 'Available',
            description: '',
        });
        setEditingProductId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const openEditModal = (product: Product) => {
        setNewProduct({
            name: product.name,
            img: product.img,
            price: product.price.toString(),
            status: product.status,
            category: product.category,
            gender: product.gender,
            outfitName: product.outfitName,
            outfitType: product.outfitType,
            skinTone: product.skinTone || [],
            description: product.description,
            brand: product.brand,
            fabricType: product.fabricType,
            color: product.color,
        });
        setEditingProductId(product.id);
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setNewProduct(prev => ({ ...prev, img: "" }));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setNewProduct(prev => ({ ...prev, img: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !newProduct.name ||
            !newProduct.price ||
            !newProduct.img ||
            !newProduct.category ||
            !newProduct.gender ||
            !newProduct.outfitName ||
            !newProduct.outfitType ||
            newProduct.skinTone.length === 0 ||
            !newProduct.fabricType ||
            !newProduct.color ||
            !newProduct.brand ||
            !newProduct.description
        ) {
            alert("Please fill in all required fields.");
            return;
        }
        const db = getDatabase();
        const productData = {
            name: newProduct.name,
            img: newProduct.img,
            price: Number(newProduct.price),
            status: newProduct.status,
            category: newProduct.category,
            gender: newProduct.gender,
            outfitName: newProduct.outfitName,
            outfitType: newProduct.outfitType,
            skinTone: newProduct.skinTone,
            description: newProduct.description,
            brand: newProduct.brand,
            fabricType: newProduct.fabricType,
            color: newProduct.color,
        };
        try {
            if (editingProductId) {
                const productRef = ref(db, `products/${editingProductId}`);
                await update(productRef, productData);
                alert("Product updated successfully!");
            } else {
                const productsRef = ref(db, "products");
                await push(productsRef, productData);
                alert("Product added successfully!");
            }
            closeModal();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        if (!isConfirmed) return;
        const db = getDatabase();
        const productRef = ref(db, `products/${id}`);
        try {
            await remove(productRef);
            alert("Product deleted successfully!");
        } catch (error: any) {
            alert("Error deleting product: " + error.message);
        }
    };

    // CSV export
    const handleDownloadCSV = () => {
        const csvContent = [
            [
                "Product ID", "Product Name", "Product Image (Base64)", "Price", "Status",
                "Category", "Gender", "Outfit Name", "Outfit Type",
                "Description", "Brand", "Fabric Type", "Color",
            ],
            ...filteredProducts.map((p) => [
                p.id, p.name, p.img, p.price, p.status, p.category, p.gender,
                p.outfitName, p.outfitType,
                p.description, p.brand, p.fabricType, p.color,
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
        let exportProducts = products;
        if (pdfExportFilter === 'category' && selectedCategory !== 'All') {
            exportProducts = products.filter(p => p.category === selectedCategory);
        }
        if (pdfExportFilter === 'status' && selectedStatus !== 'All') {
            exportProducts = products.filter(p => p.status === selectedStatus);
        }

        const doc = new jsPDF({ orientation: 'landscape' });
        const dateStr = new Date().toLocaleDateString();
        const pageWidth = doc.internal.pageSize.getWidth();


        // Header
        doc.setFont("Oleo Script Swash Caps", "bold");
        doc.setFontSize(22);
        doc.setTextColor(11, 46, 51);
        doc.text("StyleSync", 14, 15);

        // Right side: Product Inventory Report and Generated on
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(79, 124, 130);
        doc.text("Product Inventory Report", pageWidth - 14, 15, { align: 'right' });
        doc.text(`Generated on: ${dateStr}`, pageWidth - 14, 22, { align: 'right' });
        if (pdfExportFilter === 'category' && selectedCategory !== 'All') {
            doc.text(`Category Filter: ${selectedCategory}`, 270, 22, { align: 'right' });
        } else if (pdfExportFilter === 'status' && selectedStatus !== 'All') {
            doc.text(`Status Filter: ${selectedStatus}`, 270, 22, { align: 'right' });
        }

        // Table Columns
        const tableColumn = [
            "ID", "Name", "Price", "Status", "Category",
            "Outfit Name", "Outfit Type", "Brand", "Fabric Type",
        ];

        // Table Rows
        const tableRows = exportProducts.map(p => [
            p.id,
            p.name,
            `INR ${p.price.toFixed(2)}`,
            p.status,
            p.category,
            p.outfitName,
            p.outfitType,
            p.brand,
            p.fabricType,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 34,
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: [33, 37, 41],
                lineColor: [224, 224, 224],
                lineWidth: 0.1,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [11, 46, 51],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 11,
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250], // #f8f9fa
                textColor: [33, 37, 41],
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
            },
            columnStyles: {
                0: { cellWidth: 28 },
                1: { cellWidth: 40 },
                2: { cellWidth: 28 },
                3: { cellWidth: 24 },
                4: { cellWidth: 30 },
                5: { cellWidth: 34 },
                6: { cellWidth: 30 },
                7: { cellWidth: 28 },
                8: { cellWidth: 30 },
            },
            margin: { top: 34, left: 10, right: 10 },
            didDrawPage: (data) => {
                const pageCount = doc.getNumberOfPages();
                doc.setFontSize(9);
                doc.setTextColor(79, 124, 130);
                doc.text(
                    `Page ${data.pageNumber} of ${pageCount}`,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
            },
        });

        doc.save("StyleSync_Product_Report_.pdf");
    };

    // Pagination navigation
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handlePageGroupChange = (direction: "next" | "prev") => {
        if (direction === "next" && (pageGroup + 1) * 5 < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * 5 + 6);
        }
        if (direction === "prev" && pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage((pageGroup - 1) * 5 + 1);
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const pagesToShow = [];
    const safeTotalPages = Math.max(0, totalPages);
    for (
        let i = pageGroup * 5 + 1;
        i <= Math.min(safeTotalPages, pageGroup * 5 + 5);
        i++
    ) {
        pagesToShow.push(i);
    }

    const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];
    const uniqueStatuses = ["All", ...new Set(products.map(p => p.status))];

    return (
        <>
            <div className="product-manage-container">
                <div className="product-header-wrapper">
                    <div className="manageProduct-header">
                        <h3 className="order-title">Product Management</h3>
                        <IonButtons slot="end">
                            <IonButton onClick={openAddModal} className="product-add-button">
                                Add Product
                            </IonButton>
                        </IonButtons>
                    </div>
                </div>

                <div className="filters-and-search-container">
                    <div className="search-container">
                        <input
                            type="search"
                            placeholder="Search by product name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-container">
                        <IonItem className="filter-item">
                            <IonLabel>Status:</IonLabel>
                            <IonSelect
                                value={filterStatus}
                                onIonChange={(e) => setFilterStatus(e.detail.value!)}
                                className="filter-select"
                            >
                                {uniqueStatuses.map((status) => (
                                    <IonSelectOption key={status} value={status}>
                                        {status}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <IonItem className="filter-item">
                            <IonLabel>Category:</IonLabel>
                            <IonSelect
                                value={filterCategory}
                                onIonChange={(e) => setFilterCategory(e.detail.value!)}
                                className="filter-select"
                            >
                                {uniqueCategories.map((category) => (
                                    <IonSelectOption key={category} value={category}>
                                        {category}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{indexOfFirstProduct + index + 1}</td>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price.toFixed(2)}</td>
                                    <td>{product.status}</td>
                                    <td>{product.category}</td>
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
                                    <td colSpan={7} className="no-products">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
                        {/* ...form code unchanged... */}
                    </IonContent>
                </IonModal>

                <div className="pdf-export-filter">
                    <label>
                        <input
                            type="radio"
                            name="pdfExport"
                            value="all"
                            checked={pdfExportFilter === 'all'}
                            onChange={() => setPdfExportFilter('all')}
                        />
                        Download All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="pdfExport"
                            value="category"
                            checked={pdfExportFilter === 'category'}
                            onChange={() => setPdfExportFilter('category')}
                        />
                        Download by Category
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="pdfExport"
                            value="status"
                            checked={pdfExportFilter === 'status'}
                            onChange={() => setPdfExportFilter('status')}
                        />
                        Download by Status
                    </label>
                    {pdfExportFilter === 'category' && (
                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    )}
                    {pdfExportFilter === 'status' && (
                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                            {uniqueStatuses.map(stat => (
                                <option key={stat} value={stat}>{stat}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductManage;