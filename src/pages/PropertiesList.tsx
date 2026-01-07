'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
}

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'شقة فاخرة',
    area: 'سيدي بشر',
    price: 500000,
    rooms: 3,
    bathrooms: 2,
    size: 150,
    status: 'pending',
    images: ['/placeholder.svg'],
  },
  {
    id: '2',
    name: 'فيلا حديثة',
    area: 'سموحة',
    price: 1200000,
    rooms: 4,
    bathrooms: 3,
    size: 250,
    status: 'approved',
    images: ['/placeholder.svg'],
  },
  {
    id: '3',
    name: 'شقة في المنتزه',
    area: 'المنتزه',
    price: 600000,
    rooms: 3,
    bathrooms: 2,
    size: 180,
    status: 'approved',
    images: ['/placeholder.svg'],
  },
];

export default function PropertiesList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.includes(searchQuery) || property.area.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleView = (id: string) => {
    navigate(`/property/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="العقارات"
        subtitle="عرض و إدارة جميع العقارات"
      />
      <div className="p-6 lg:p-8">
        {/* أزرار البحث والفلاتر */}
        <div className="mb-6 rounded-lg bg-card p-4 shadow-card">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="بحث عن عقار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => navigate('/add')}
              className="gradient-primary gap-2 w-full md:w-auto"
            >
              <Plus className="h-4 w-4" />
              إضافة عقار
            </Button>
          </div>

          {/* الفلاتر */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status as any)}
                size="sm"
              >
                {status === 'all' && 'الكل'}
                {status === 'pending' && 'قيد المراجعة'}
                {status === 'approved' && 'موافق عليه'}
                {status === 'rejected' && 'مرفوض'}
              </Button>
            ))}
          </div>
        </div>

        {/* قائمة العقارات */}
        {filteredProperties.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-card p-12 text-center shadow-card">
            <p className="text-muted-foreground">لا توجد عقارات حالياً</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
