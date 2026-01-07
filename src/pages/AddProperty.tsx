'use client';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";

export default function AddProperty() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, area, price });
    alert("تم إضافة العقار (mock)!");
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="إضافة عقار جديد" subtitle="املأ بيانات العقار" />

      <div className="p-6 lg:p-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="اسم العقار"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="المنطقة"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            placeholder="السعر"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="input input-bordered w-full"
            required
          />
          <Button type="submit">إضافة العقار</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
