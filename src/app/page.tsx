"use client";

import React, { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { Checkbox } from "@app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@app/components/ui/card";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface Product {
  code: string;
  origin: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState<Product>({
    code: "",
    origin: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts = products.filter((product) =>
    product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (code: string) => {
    setSelectedProducts((current) =>
      current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ code: "", origin: "" });
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const selectedData = products.filter((product) =>
      selectedProducts.includes(product.code)
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(selectedData);

    XLSX.utils.book_append_sheet(wb, ws, "Seçili Ürünler");

    XLSX.writeFile(wb, "secili-urunler.xlsx");
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Yeni Ürün Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Ürün Kodu"
                value={newProduct.code}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, code: e.target.value })
                }
              />
              <Input
                placeholder="Menşei"
                value={newProduct.origin}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, origin: e.target.value })
                }
              />
              <Button type="submit">Kaydet</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* All Products Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tüm Ürünler</CardTitle>
            <div className="mt-4">
              <Input
                placeholder="Ürün kodu ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Seç</TableHead>
                  <TableHead>Ürün Kodu</TableHead>
                  <TableHead>Menşei</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.code}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.code)}
                        onCheckedChange={() =>
                          handleProductSelect(product.code)
                        }
                      />
                    </TableCell>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.origin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Selected Products Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Seçili Ürünler</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedProducts.length === 0}
                onClick={exportToExcel}
              >
                <Download className="mr-2 h-4 w-4" />
                Excel&apos;e Aktar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün Kodu</TableHead>
                  <TableHead>Menşei</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .filter((product) => selectedProducts.includes(product.code))
                  .map((product) => (
                    <TableRow key={product.code}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.origin}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
