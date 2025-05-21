import React, { useState } from "react";
import "./ManageProduct.css";
import { getDatabase, ref, push } from "firebase/database";

interface Product {
    name: string;
    price: number;
    description: string;
    img: string;
    category: string;
    gender: string;
    outfitName: string;
    outfitType: string;
    skinTone: string[];
}

const initialProduct: Product = {
    name: "",
    price: 0,
    description: "",
    img: "",
    category: "",
    gender: "",
    outfitName: "",
    outfitType: "",
    skinTone: [],
};

const skinToneOptions = ["Fair Skin", "Dusky Skin", "Dark Skin"];
const genderOptions = ["male", "female",];
const outfitTypeOptions = ["one-piece", "bottom", "top"];
const categoryOptions = ["Formals", "Casuals", "Ocassions"];


const ManageProduct: React.FC = () => {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [message, setMessage] = useState<string>("");
    const [imgPreview, setImgPreview] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleSkinToneChange = (tone: string) => {
        setProduct((prev) => ({
            ...prev,
            skinTone: prev.skinTone.includes(tone)
                ? prev.skinTone.filter((t) => t !== tone)
                : [...prev.skinTone, tone],
        }));
    };

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setProduct(prev => ({ ...prev, img: base64String }));
            setImgPreview(base64String);
        };
        reader.readAsDataURL(file); // This converts to Base64
    }
};
    const handleImageRemove = () => {
        setProduct((prev) => ({ ...prev, img: "" }));
        setImgPreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const db = getDatabase();
            const productsRef = ref(db, 'products');

            await push(productsRef, product);

            setMessage("Product added successfully!");
            setProduct(initialProduct);
            setImgPreview("");
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("Failed to add product. Please try again.");
        }
    };


    return (
        <div className="manage-product-container">
            <h2 className="manage-product-title">Add New Product</h2>
            <form onSubmit={handleSubmit} className="manage-product-form">
                <div className="manage-product-row">
                    <div>
                        <label className="manage-product-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className="manage-product-input"
                        />
                    </div>
                    <div>
                        <label className="manage-product-label">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            min={0}
                            className="manage-product-input"
                        />
                    </div>
                </div>
                <div>
                    <label className="manage-product-label">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="manage-product-textarea"
                    />
                </div>
                <div className="manage-product-row">
                    <div>
                        <label className="manage-product-label">Category</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            className="manage-product-select"
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label className="manage-product-label">Gender</label>
                        <select
                            name="gender"
                            value={product.gender}
                            onChange={handleChange}
                            required
                            className="manage-product-select"
                        >
                            <option value="">Select</option>
                            {genderOptions.map((g) => (
                                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="manage-product-row">
                    <div>
                        <label className="manage-product-label">Outfit Name</label>
                        <input
                            type="text"
                            name="outfitName"
                            value={product.outfitName}
                            onChange={handleChange}
                            required
                            className="manage-product-input"
                        />
                    </div>
                    <div>
                        <label className="manage-product-label">Outfit Type</label>
                        <select
                            name="outfitType"
                            value={product.outfitType}
                            onChange={handleChange}
                            required
                            className="manage-product-select"
                        >
                            <option value="">Select</option>
                            {outfitTypeOptions.map((type) => (
                                <option key={type} value={type}>{type.replace("-", " ")}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="manage-product-label">Skin Tone</label>
                    <div className="manage-product-checkbox-group">
                        {skinToneOptions.map((tone) => (
                            <label
                                key={tone}
                                className={
                                    "manage-product-checkbox-label" +
                                    (product.skinTone.includes(tone) ? " selected" : "")
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={product.skinTone.includes(tone)}
                                    onChange={() => handleSkinToneChange(tone)}
                                />
                                {tone}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="manage-product-label">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="manage-product-input"
                    />
                    {(imgPreview || product.img) && (
                        <div className="manage-product-image-preview">
                            <img src={imgPreview || product.img} alt="Preview" />
                        </div>
                    )}
                </div>
                <button type="submit" className="manage-product-submit">
                    Add Product
                </button>
            </form>
            {message && <div className="manage-product-message">{message}</div>}
        </div>
    );
};

export default ManageProduct;