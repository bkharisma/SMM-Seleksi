interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export default function Card({ children, className = '', title, action }: CardProps) {
    return (
        <div className={`rounded-xl bg-surface-container-lowest shadow ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between border-b px-6 py-4 border-outline-variant">
                    {title && <h3 className="text-lg font-semibold text-on-background">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
