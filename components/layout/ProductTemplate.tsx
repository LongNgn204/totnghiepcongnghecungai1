import React from 'react';

interface ProductTemplateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  heroGradientFrom?: string;
  heroGradientTo?: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  icon,
  title,
  subtitle,
  heroGradientFrom = 'from-primary-600',
  heroGradientTo = 'to-secondary-600',
  sidebar,
  children,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 animate-fade-in">
      {/* Hero */}
      <section className={`relative overflow-hidden rounded-3xl glass-panel border-0 p-8 text-white shadow-xl`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${heroGradientFrom} ${heroGradientTo} opacity-90`}></div>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
          {icon}
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-white/90 max-w-3xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
        </div>
      </section>

      {/* Content */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {children}
        </div>
        {sidebar && (
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {sidebar}
            </div>
          </aside>
        )}
      </section>
    </div>
  );
};

export default ProductTemplate;
