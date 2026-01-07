'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  name: string;
  name_en: string;
  area: string;
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnished: boolean;
  usage_type: string;
  type: string;
  description: string;
  contact: string;
  status: PropertyStatus;
  rejection_reason?: string;
  images: string[];
  videos: string[];
  featured: boolean;
  created_at: string;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'created_at'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByStatus: (status: PropertyStatus) => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'شقة فاخرة في سيدي بشر',
      name_en: 'Luxury Apartment in Sidi Bishr',
      area: 'سيدي بشر',
      address: 'شارع النيل',
      price: 500000,
      rooms: 3,
      bathrooms: 2,
      size: 150,
      floor: 5,
      furnished: true,
      usage_type: 'سكني',
      type: 'شقة',
      description: 'شقة فاخرة مع إطلالة على البحر',
      contact: '01012345678',
      status: 'approved',
      images: ['/placeholder.svg'],
      videos: [],
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'فيلا حديثة في سموحة',
      name_en: 'Modern Villa in Smoha',
      area: 'سموحة',
      address: 'شارع الجيش',
      price: 1200000,
      rooms: 4,
      bathrooms: 3,
      size: 250,
      floor: 0,
      furnished: false,
      usage_type: 'سكني',
      type: 'فيلا',
      description: 'فيلا حديثة مع حديقة كبيرة',
      contact: '01098765432',
      status: 'approved',
      images: ['/placeholder.svg'],
      videos: [],
      featured: true,
      created_at: new Date().toISOString(),
    },
  ]);

  const addProperty = useCallback((property: Omit<Property, 'id' | 'created_at'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setProperties((prev) => [newProperty, ...prev]);
  }, []);

  const updateProperty = useCallback(
    (id: string, updates: Partial<Property>) => {
      setProperties((prev) =>
        prev.map((prop) => (prop.id === id ? { ...prop, ...updates } : prop))
      );
    },
    []
  );

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
  }, []);

  const getPropertyById = useCallback(
    (id: string) => {
      return properties.find((prop) => prop.id === id);
    },
    [properties]
  );

  const getPropertiesByStatus = useCallback(
    (status: PropertyStatus) => {
      return properties.filter((prop) => prop.status === status);
    },
    [properties]
  );

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        getPropertiesByStatus,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within PropertyProvider');
  }
  return context;
}
