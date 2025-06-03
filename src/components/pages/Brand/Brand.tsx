import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import "./Brand.css";

const Brand: React.FC = () => {
  const Brands = useSelector((state: RootState) => state.brand.Brands);

  return (
    <div className="pagebrand">
      <div className="page-container">
        <h1 className="page-name">Famous Brands</h1>
        <p className="brand-tagline">
          Discover top brands trusted by millions. Shop your favorites and explore new trends!
        </p>
        <div className="brand-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Brand Image</th>
                <th>Brand Name</th>
                <th>Brand Details</th>
              </tr>
            </thead>
            <tbody>
              {Brands.map((brand, idx) => (
                <tr key={brand.id || idx}>
                  <td>
                    <img
                      src={brand.img}
                      alt={brand.name}
                      className="brand-table-img"
                    />
                  </td>
                  <td className="brand-table-name">{brand.name}</td>
                  <td>
                    {brand.link ? (
                      <a href={brand.link} target="_blank" rel="noopener noreferrer">
                        Visit Brand
                      </a>
                    ) : (
                      <span>No link</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Brand;