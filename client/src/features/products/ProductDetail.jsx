import { Modal, Badge } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import {
  Package,
  Barcode,
  Tag,
  Truck,
  Hash,
  ShoppingCart,
  AlertTriangle,
  StickyNote,
  TrendingUp,
  TrendingDown,
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

const ProductDetail = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  const isLowStock = product.stock <= (product.minStock || 5);
  const margin = product.sellingPrice && product.buyingPrice
    ? (((Number(product.sellingPrice) - Number(product.buyingPrice)) / Number(product.sellingPrice)) * 100).toFixed(1)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-surface-100 dark:border-surface-700">
          <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <Package className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {product.name}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              SKU: {product.sku}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={product.isActive ? 'success' : 'default'} size="sm" dot>
                {product.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {isLowStock && (
                <Badge variant="warning" size="sm">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={Tag} label="Category" value={product.category?.name} />
          <InfoRow icon={Truck} label="Supplier" value={product.supplier?.name || product.supplier?.company} />
          <InfoRow icon={Barcode} label="Barcode" value={product.barcode} />
          <InfoRow icon={Hash} label="Stock" value={`${product.stock} units (Min: ${product.minStock || 5})`} />
          <InfoRow icon={TrendingDown} label="Buying Price" value={formatCurrency(product.buyingPrice)} />
          <InfoRow icon={TrendingUp} label="Selling Price" value={formatCurrency(product.sellingPrice)} />
          <InfoRow icon={ShoppingCart} label="Used in Invoices" value={product._count?.invoiceItems ?? 0} />
          {margin && <InfoRow icon={TrendingUp} label="Profit Margin" value={`${margin}%`} />}
        </div>

        {/* Description */}
        {product.description && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-surface-400" />
              <span className="text-xs text-surface-400 dark:text-surface-500">Description</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Stock Value</p>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatCurrency(Number(product.sellingPrice || 0) * (product.stock || 0))}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Profit per Unit</p>
            <p className="text-lg font-bold text-success-600 dark:text-success-400">
              {formatCurrency(Number(product.sellingPrice || 0) - Number(product.buyingPrice || 0))}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetail;
