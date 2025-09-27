import { cn } from '@/lib/utils';

const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };