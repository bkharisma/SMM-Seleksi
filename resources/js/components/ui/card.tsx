interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export default function Card({ children, className = '', title, action }: CardProps) {
    return (
        <div className={`rounded-xl bg-white shadow dark:bg-gray-800 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                    {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
