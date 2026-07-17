import { Modal, Badge, Avatar } from '../../components/ui';
import { formatCurrency, formatDate, formatNumber } from '../../lib/utils';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  Star,
  Clock,
  StickyNote,
} from 'lucide-react';

const statusVariants = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  ON_LEAVE: 'warning',
  TERMINATED: 'danger',
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

const EmployeeDetail = ({ isOpen, onClose, employee }) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Details"
      size="md"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-surface-100 dark:border-surface-700">
          <Avatar name={employee.name} src={employee.photo} size="xl" />
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {employee.name}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {employee.position} · {employee.department}
            </p>
            <div className="mt-1.5">
              <Badge variant={statusVariants[employee.status]} size="sm" dot>
                {employee.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InfoRow icon={Mail} label="Email" value={employee.email} />
          <InfoRow icon={Phone} label="Phone" value={employee.phone} />
          <InfoRow icon={Building2} label="Department" value={employee.department} />
          <InfoRow icon={Briefcase} label="Position" value={employee.position} />
          <InfoRow icon={IndianRupee} label="Salary" value={formatCurrency(employee.salary)} />
          <InfoRow icon={Calendar} label="Joining Date" value={formatDate(employee.joiningDate)} />
          <InfoRow
            icon={Clock}
            label="Attendance Rate"
            value={employee.attendanceRate != null ? `${Number(employee.attendanceRate)}%` : null}
          />
          <InfoRow
            icon={Star}
            label="Performance Rating"
            value={employee.performanceRate != null ? `${Number(employee.performanceRate)} / 5.0` : null}
          />
          <InfoRow icon={MapPin} label="Address" value={employee.address} />
        </div>

        {/* Notes */}
        {employee.notes && (
          <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-surface-400" />
              <span className="text-xs text-surface-400 dark:text-surface-500">Notes</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
              {employee.notes}
            </p>
          </div>
        )}

        {/* Leaves */}
        <div className="flex items-center gap-6 pt-4 border-t border-surface-100 dark:border-surface-700">
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Leaves Taken</p>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatNumber(employee.leaves || 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-400 dark:text-surface-500">Member Since</p>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatDate(employee.createdAt, { year: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetail;
