import { Modal, Badge } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Globe,
  StickyNote,
  Package,
} from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
      </div>
      <div>
        <p className="text-xs text-surface-400 dark:text-surface-500">{label}</p>
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{value}</p>
      </div>
    </div>
  );
};

const SupplierDetail = ({ isOpen, onClose, supplier }) => {
  if (!supplier) return null;

  const fullAddress = [supplier.address, supplier.city, supplier.state, supplier.zipCode]
    .filter(Boolean)
    .join(', ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supplier Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-surface-100 dark:border-surface-700">
          <div className="w-14 h-14 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-warning-600 dark:text-warning-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {supplier.name}
            </h3>
            {supplier.company && (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {supplier.company}
              </p>
            )}
            <div className="mt-1.5">
              <Badge variant="default" size="sm">
                {supplier._count?.products ?? 0} Products
              </Badge>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={Mail} label="Email" value={supplier.email} />
          <InfoRow icon={Phone} label="Phone" value={supplier.phone} />
          <InfoRow icon={Building2} label="Company" value={supplier.company} />
          <InfoRow icon={Hash} label="GST Number" value={supplier.gstNumber} />
          <InfoRow icon={Globe} label="City" value={supplier.city} />
          <InfoRow icon={MapPin} label="Address" value={fullAddress} />
        </div>

        {/* Notes */}
        {supplier.notes && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-surface-400" />
              <span className="text-xs text-surface-400 dark:text-surface-500">Notes</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
              {supplier.notes}
            </p>
          </div>
        )}

        {/* Linked Products */}
        {supplier.products && supplier.products.length > 0 && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">
              Products Supplied
            </h4>
            <div className="space-y-2">
              {supplier.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-50 dark:bg-surface-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        {product.name}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                    <Badge
                      variant={product.isActive ? 'success' : 'default'}
                      size="sm"
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SupplierDetail;
