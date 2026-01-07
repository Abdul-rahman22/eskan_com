import { Property } from '@/types/property';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, AlertCircle, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PropertyCard({ property, onView, onEdit, onDelete }: PropertyCardProps) {
  const canModify = property.status === 'pending';
  
  return (
    <div className="animate-slide-in group overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-video">
        <img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
          <StatusBadge status={property.status} size="sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 sm:p-4">
          <p className="text-lg font-bold text-card sm:text-xl">
            {property.price.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="mb-2 text-base font-bold text-foreground line-clamp-1 sm:text-lg">
          {property.name}
        </h3>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground sm:mb-3 sm:text-sm">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">{property.area}</span>
        </div>
        
        {/* Features */}
        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground sm:mb-4 sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{property.rooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{property.size} م²</span>
          </div>
        </div>
        
        {/* Rejection Reason */}
        {property.status === 'rejected' && property.rejection_reason && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive sm:mb-4 sm:p-3 sm:text-sm">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="line-clamp-2">{property.rejection_reason}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => onView(property.id)}
          >
            <Eye className="ml-1 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
            عرض
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(property.id)}
            disabled={!canModify}
            className={cn('p-2 sm:p-2.5', !canModify && 'cursor-not-allowed opacity-50')}
          >
            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(property.id)}
            disabled={!canModify}
            className={cn(
              'p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground sm:p-2.5',
              !canModify && 'cursor-not-allowed opacity-50'
            )}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
