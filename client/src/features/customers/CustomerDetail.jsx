import { Modal, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Hash,
  Globe,
  StickyNote,
  ShoppingCart,
} from 'lucide-react';

const invoiceStatusVariants = {
  PAID: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
};

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

const CustomerDetail = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const fullAddress = [customer.address, customer.city, customer.state, customer.zipCode]
    .filter(Boolean)
    .join(', ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-surface-100 dark:border-surface-700">
          <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {customer.name}
            </h3>
            {customer.company && (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {customer.company}
              </p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={Mail} label="Email" value={customer.email} />
          <InfoRow icon={Phone} label="Phone" value={customer.phone} />
          <InfoRow icon={Building2} label="Company" value={customer.company} />
          <InfoRow icon={Hash} label="GST Number" value={customer.gstNumber} />
          <InfoRow icon={Globe} label="City" value={customer.city} />
          <InfoRow icon={MapPin} label="Address" value={fullAddress} />
          <InfoRow
            icon={ShoppingCart}
            label="Total Purchases"
            value={formatCurrency(customer.totalPurchase)}
          />
          <InfoRow
            icon={FileText}
            label="Total Invoices"
            value={customer._count?.invoices ?? 0}
          />
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-surface-400" />
              <span className="text-xs text-surface-400 dark:text-surface-500">Notes</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
              {customer.notes}
            </p>
          </div>
        )}

        {/* Recent Invoices */}
        {customer.invoices && customer.invoices.length > 0 && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">
              Recent Invoices
            </h4>
            <div className="space-y-2">
              {customer.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-50 dark:bg-surface-800"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                      {formatDate(inv.invoiceDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {formatCurrency(inv.grandTotal)}
                    </span>
                    <Badge variant={invoiceStatusVariants[inv.status]} size="sm">
                      {inv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Customer Since</p>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatDate(customer.createdAt, { year: 'numeric', month: 'short' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Lifetime Value</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(customer.totalPurchase)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetail;
