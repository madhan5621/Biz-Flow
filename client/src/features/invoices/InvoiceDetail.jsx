import { Modal, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  FileText,
  User,
  Calendar,
  Clock,
  Hash,
  Package,
  StickyNote,
  CreditCard,
} from 'lucide-react';

const statusVariants = {
  PAID: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
};

const InfoRow = ({ icon: Icon, label, value, className = '' }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
      </div>
      <div>
        <p className="text-xs text-surface-400 dark:text-surface-500">{label}</p>
        <p className={`text-sm font-medium text-surface-900 dark:text-surface-100 ${className}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

const InvoiceDetail = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-100 dark:border-surface-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {invoice.invoiceNumber}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {invoice.customer?.name}
                {invoice.customer?.company && ` — ${invoice.customer.company}`}
              </p>
            </div>
          </div>
          <Badge variant={statusVariants[invoice.status]} size="md">
            {invoice.status}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={User} label="Customer" value={invoice.customer?.name} />
          <InfoRow icon={Hash} label="Invoice Number" value={invoice.invoiceNumber} />
          <InfoRow icon={Calendar} label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
          <InfoRow icon={Clock} label="Due Date" value={invoice.dueDate ? formatDate(invoice.dueDate) : '—'} />
          <InfoRow
            icon={CreditCard}
            label="Grand Total"
            value={formatCurrency(invoice.grandTotal)}
            className="text-primary-600 dark:text-primary-400"
          />
          <InfoRow icon={FileText} label="Items" value={`${invoice.items?.length || invoice._count?.items || 0} line items`} />
        </div>

        {/* Items Table */}
        {invoice.items && invoice.items.length > 0 && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-surface-400" />
              Invoice Items
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">Product</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">Qty</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">Price</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">Disc.</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-surface-500 dark:text-surface-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-surface-100 dark:border-surface-800"
                    >
                      <td className="py-2.5 px-2">
                        <p className="font-medium text-surface-900 dark:text-surface-100">
                          {item.product?.name || '—'}
                        </p>
                        {item.product?.sku && (
                          <p className="text-xs text-surface-400 dark:text-surface-500">{item.product.sku}</p>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right text-surface-700 dark:text-surface-300">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-2 text-right text-surface-700 dark:text-surface-300">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-surface-700 dark:text-surface-300">
                        {Number(item.discount) > 0 ? formatCurrency(item.discount) : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-semibold text-surface-900 dark:text-surface-100">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500 dark:text-surface-400">Subtotal</span>
                <span className="text-surface-900 dark:text-surface-100">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              {Number(invoice.taxRate) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 dark:text-surface-400">Tax ({Number(invoice.taxRate)}%)</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {formatCurrency(invoice.taxAmount)}
                  </span>
                </div>
              )}
              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 dark:text-surface-400">Discount</span>
                  <span className="text-danger-500">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-surface-200 dark:border-surface-700">
                <span className="text-surface-900 dark:text-surface-100">Grand Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatCurrency(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-surface-400" />
              <span className="text-xs text-surface-400 dark:text-surface-500">Notes</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-6 pt-4 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Created</p>
            <p className="text-sm font-bold text-surface-900 dark:text-surface-100">
              {formatDate(invoice.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Last Updated</p>
            <p className="text-sm font-bold text-surface-900 dark:text-surface-100">
              {formatDate(invoice.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceDetail;
