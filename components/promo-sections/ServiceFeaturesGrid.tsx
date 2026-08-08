import type { ReactNode } from 'react';

export type ServiceFeature = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
};

type Props = {
  services: ServiceFeature[];
  className?: string;
};

export default function ServiceFeaturesGrid({ services, className = '' }: Props) {
  return (
    <section
      className={`container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-8 sm:mt-12 lg:mt-16 ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-base-content">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-base-content mb-1">{service.title}</h3>
              <p className="text-sm text-base-content/60">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
