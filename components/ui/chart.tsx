/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

const useChart = () => {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used inside a <ChartContainer />');
  }

  return context;
};

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid_line]:stroke-base-content/20 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-base-content/40 [&_.recharts-text]:fill-base-content/80 [&_.recharts-sector]:outline-none',
          className
        )}
        {...props}
      >
        <Style config={config} chartId={chartId} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

const Style = ({ chartId, config }: { chartId: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, value]) => value.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
  [data-chart="${chartId}"] {
  ${colorConfig.map(([key, item]) => `--color-${key}: ${item.color};`).join('\n')}
  }
`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipPayloadItem = {
  dataKey?: string | number;
  name?: string;
  value?: any;
  color?: string;
  payload?: Record<string, any>;
};

type ChartTooltipContentProps = React.ComponentProps<'div'> & {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  formatter?: (
    value: any,
    name: string | undefined,
    item: TooltipPayloadItem,
    index: number,
    payload: Record<string, any> | undefined
  ) => React.ReactNode;
  labelFormatter?: (label: any, payload: TooltipPayloadItem[]) => React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot';
  nameKey?: string;
  labelKey?: string;
};

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      formatter,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    const firstPayload = payload[0];
    const payloadKey = `${labelKey || firstPayload.dataKey || firstPayload.name || 'value'}`;
    const itemConfig = config[payloadKey];
    const tooltipLabel = !hideLabel
      ? labelFormatter
        ? labelFormatter(label, payload)
        : (itemConfig?.label ?? label)
      : null;

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border bg-base-100 px-3 py-2 text-sm shadow-md', className)}
      >
        {tooltipLabel ? <div className="mb-1 font-medium">{tooltipLabel}</div> : null}
        <div className="grid gap-1">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || index}`;
            const entry = config[key] || config[`${item.dataKey}`] || {};
            const indicatorColor = item.color || `var(--color-${item.dataKey})`;

            return (
              <div
                key={`${item.dataKey}-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  {!hideIndicator ? (
                    <span
                      className={cn(
                        'inline-block shrink-0 rounded-[2px]',
                        indicator === 'dot' ? 'h-2.5 w-2.5 rounded-full' : 'h-2 w-3'
                      )}
                      style={{ backgroundColor: indicatorColor }}
                    />
                  ) : null}
                  <span className="text-base-content/80">{entry.label || item.name}</span>
                </div>
                <span className="font-semibold text-base-content">
                  {formatter
                    ? formatter(item.value, item.name, item, index, item.payload)
                    : item.value?.toLocaleString?.() || item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = RechartsPrimitive.Legend;

type LegendPayloadItem = {
  value?: string;
  color?: string;
  dataKey?: string | number;
};

type ChartLegendContentProps = React.ComponentProps<'div'> & {
  payload?: LegendPayloadItem[];
  hideIcon?: boolean;
  nameKey?: string;
};

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, payload, hideIcon = false, nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div ref={ref} className={cn('flex flex-wrap items-center justify-center gap-4', className)}>
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const entry = config[key] || {};
          return (
            <div key={item.value} className="flex items-center gap-2">
              {!hideIcon ? (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color || `var(--color-${item.dataKey})` }}
                />
              ) : null}
              <span className="text-sm text-base-content/80">{entry.label || item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegendContent';

export { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent };
