"use client";
/* eslint-disable */
import * as xlsx from "xlsx";

import React, { useState } from "react";

interface Customer {
  id: string;
  companyName: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState<any>({ code: "", origin: "" });

  const [products, setProducts] = useState<any>([
    { code: "P001", origin: "United States" },
    { code: "P002", origin: "Japan" },
    { code: "P003", origin: "Germany" },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const filteredProducts = products.filter((product: { code: string }) =>
    product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleProductSelect = (code: string) => {
    if (selectedProducts.includes(code)) {
      setSelectedProducts(selectedProducts.filter((c: any) => c !== code));
    } else {
      setSelectedProducts([...selectedProducts, code] as string[]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ code: "", origin: "" });
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const selectedData = products.filter((product: any) =>
      selectedProducts.includes(product.code)
    );

    const ws = xlsx.utils.json_to_sheet(selectedData);

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Seçili Ürünler");

    xlsx.writeFile(wb, "secili-urunler.xlsx");
  };

  const handleSaveToBasket = () => {
    if (!selectedCustomer) {
      alert("Lütfen bir müşteri seçiniz");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("Lütfen en az bir ürün seçiniz");
      return;
    }

    alert("Ürünler sepete eklendi!");
    // API call would go here
  };

  return (
    <div className="min-h-screen p-8 sm:p-10">
      {/* Main Container */}
      <div className="flex flex-col space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Yeni Ürün Ekle
          </button>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Ürün kodu ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - All Products */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Tüm Ürünler</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Seç</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Product Code
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Origin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product: any) => (
                      <tr key={product.code}>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(
                              product.code as never
                            )}
                            onChange={() => handleProductSelect(product.code)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {product.code}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {product.origin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Selected Products */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col space-y-4 mb-4">
                <h2 className="text-xl font-bold">Seçili Ürünler</h2>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></input>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSaveToBasket}
                      disabled={selectedProducts.length === 0}
                      className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Sepete Ekle
                    </button>

                    {selectedProducts.length > 0 && (
                      <button
                        onClick={exportToExcel}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Excel'e Aktar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Product Code
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Origin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product: any) =>
                        selectedProducts.includes(product.code)
                      )
                      .map((product: any) => (
                        <tr key={product.code}>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.code}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.origin}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Yeni Ürün Ekle</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Kodu*
                </label>
                <input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: P004"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menşei*
                </label>
                <input
                  type="text"
                  value={newProduct.origin}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, origin: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: Turkey"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setNewProduct({ code: "", origin: "" });
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
