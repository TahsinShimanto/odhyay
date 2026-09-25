import '../styles/ConfirmDialog.css'
export default function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = 'মুছুন', busy = false }) {
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button type="button" onClick={onCancel} disabled={busy}>
                        বাতিল
                    </button>
                    <button type="button" className="confirm-danger" onClick={onConfirm} disabled={busy}>
                        {busy ? 'মুছে ফেলা হচ্ছে...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}