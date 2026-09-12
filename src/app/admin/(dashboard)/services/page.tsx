import { getServices } from "@/lib/supabase/data-service";
import { ServicesManager } from "@/components/admin/services-manager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Services & Technical Offerings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your engineering services, specialized consulting offerings, and deliverable features.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
