import { useState } from 'react';

interface Tab {
    key: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (key: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="border-b border-outline-variant">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-container hover:border-outline-variant hover:text-on-surface'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
