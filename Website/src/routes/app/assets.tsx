import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, QrCode, Download, Boxes } from "lucide-react";
import { NeuCard, PageHeader, Badge, toneForStatus, ViewModeSwitcher, type ViewMode } from "@/components/layout/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { assetsApi, categoriesApi, departmentsApi } from "@/lib/api";

const STATUSES: ("Available" | "Allocated" | "Maintenance" | "Retired" | "All")[] = ["All", "Available", "Allocated", "Maintenance", "Retired"];
const KANBAN_STAGES: ("Available" | "Allocated" | "Maintenance" | "Retired")[] = ["Available", "Allocated", "Maintenance", "Retired"];

function AssetsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [cat, setCat] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showForm, setShowForm] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, categoriesData, departmentsData] = await Promise.all([
          assetsApi.getAll(),
          categoriesApi.getAll(),
          departmentsApi.getAll(),
        ]);
        
        setAssets(assetsData.assets || []);
        setCategories(categoriesData.categories || []);
        setDepartments(departmentsData.departments || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const assetStatus = a.status || 'Available';
      const assetCategory = a.category?.name || a.category || '';
      const assetTag = a.serialNumber || a.assetTag || a.tag || '';
      const assetName = a.name || '';
      const assigneeName = a.currentHolder?.firstName && a.currentHolder?.lastName 
        ? `${a.currentHolder.firstName} ${a.currentHolder.lastName}` 
        : a.assignee || '';
      
      if (status !== "All" && assetStatus !== status) return false;
      if (cat !== "All" && assetCategory !== cat) return false;
      if (q && !`${assetName} ${assetTag} ${assigneeName}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, status, cat, assets]);

  const handleCreateAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      
      // Convert types for FormData
      if (data.acquisitionCost) data.acquisitionCost = Number(data.acquisitionCost);
      if (data.acquisitionDate) data.acquisitionDate = new Date(data.acquisitionDate).toISOString();
      
      await assetsApi.create(data);
      toast.success("Asset registered successfully");
      setShowForm(false);
      // Refresh assets
      const assetsData = await assetsApi.getAll();
      setAssets(assetsData.assets || []);
    } catch (error: any) {
      console.error('Failed to create asset:', error);
      toast.error(error.message || "Failed to register asset");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Registry"
        subtitle={`${filtered.length} of ${assets.length} assets`}
        actions={
          <>
            <ViewModeSwitcher viewMode={viewMode} onViewChange={setViewMode} />
            <button className="neu-sm inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" onClick={() => toast("Scanning QR…")}>
              <QrCode className="h-4 w-4" /> Scan
            </button>
            <button className="neu-sm inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" onClick={() => toast.success("Export queued")}>
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="neu-accent inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Register Asset
            </button>
          </>
        }
      />

      {showForm && (
        <NeuCard>
          <h3 className="mb-4 text-lg font-semibold">Register a new asset</h3>
          <form
            onSubmit={handleCreateAsset}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {[
              { l: "Asset tag", p: "AF-1050", n: "serialNumber" },
              { l: "Name", p: "MacBook Pro 16", n: "name" },
              { l: "Category", p: "Laptops", n: "category", isSelect: true, options: categories },
              { l: "Department", p: "Engineering", n: "department", isSelect: true, options: departments },
              { l: "Location", p: "Building A, Floor 2", n: "location" },
              { l: "Purchase date", p: "2026-07-12", n: "acquisitionDate", type: "date" },
              { l: "Value (USD)", p: "2499", n: "acquisitionCost", type: "number" },
            ].map((f) => (
              <label key={f.n} className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{f.l}</span>
                {f.isSelect ? (
                  <select 
                    name={f.n}
                    className="neu-inset w-full rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="">Select {f.l.toLowerCase()}</option>
                    {f.options.map((opt: any) => (
                      <option key={opt._id} value={opt._id}>{opt.name}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    name={f.n}
                    type={f.type || "text"}
                    placeholder={f.p} 
                    className="neu-inset w-full rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none" 
                  />
                )}
              </label>
            ))}
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="neu-sm rounded-xl px-4 py-2.5 text-sm">Cancel</button>
              <button type="submit" className="neu-accent rounded-xl px-4 py-2.5 text-sm font-semibold">Save asset</button>
            </div>
          </form>
        </NeuCard>
      )}

      <NeuCard>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, tag or assignee…"
            className="neu-inset min-w-[220px] flex-1 rounded-xl bg-transparent px-4 py-2.5 text-sm outline-none"
          />
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
                  status === s ? "neu-accent font-semibold" : "neu-sm text-muted-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="neu-sm rounded-xl bg-transparent px-3 py-2 text-sm outline-none"
          >
            <option>All</option>
            {categories.map((c: any) => <option key={c._id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Loading assets...</div>
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 pr-3">Tag</th>
                  <th className="py-3 pr-3">Name</th>
                  <th className="py-3 pr-3">Category</th>
                  <th className="py-3 pr-3">Department</th>
                  <th className="py-3 pr-3">Assignee</th>
                  <th className="py-3 pr-3">Value</th>
                  <th className="py-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: any) => (
                  <tr key={a._id} className="border-t border-border/50 hover:bg-muted/30">
                    <td className="py-3 pr-3 font-mono text-xs">{a.serialNumber || a.assetTag}</td>
                    <td className="py-3 pr-3 font-medium">{a.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{a.category?.name || a.category}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{a.department?.name || a.department}</td>
                    <td className="py-3 pr-3">{a.currentHolder?.firstName && a.currentHolder?.lastName ? `${a.currentHolder.firstName} ${a.currentHolder.lastName}` : <span className="text-muted-foreground">—</span>}</td>
                    <td className="py-3 pr-3">${(a.acquisitionCost || a.value || 0).toLocaleString()}</td>
                    <td className="py-3 pr-3"><Badge tone={toneForStatus(a.status)}>{a.status}</Badge></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No assets match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a: any) => (
              <div key={a._id} className="neu-inset flex flex-col justify-between rounded-xl p-4 transition-transform hover:-translate-y-0.5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{a.serialNumber || a.assetTag}</span>
                    <Badge tone={toneForStatus(a.status)}>{a.status}</Badge>
                  </div>
                  <h4 className="mt-2 text-base font-semibold">{a.name}</h4>
                  <p className="text-xs text-muted-foreground">{a.category?.name || a.category || "General Asset"}</p>
                </div>
                <div className="mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Assignee: </span>
                    <span className="font-medium">
                      {a.currentHolder?.firstName && a.currentHolder?.lastName ? `${a.currentHolder.firstName} ${a.currentHolder.lastName}` : "Unassigned"}
                    </span>
                  </div>
                  <div className="font-semibold text-primary">
                    ${(a.acquisitionCost || a.value || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">No assets match your filters.</div>
            )}
          </div>
        ) : (
          /* Kanban View */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {KANBAN_STAGES.map((stg) => {
              const stageAssets = filtered.filter((a) => (a.status || "Available").toLowerCase() === stg.toLowerCase());
              return (
                <div key={stg} className="neu rounded-xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{stg}</span>
                    <Badge tone={toneForStatus(stg)}>{stageAssets.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {stageAssets.map((a: any) => (
                      <div key={a._id} className="neu-inset rounded-xl p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                          <span>{a.serialNumber || a.assetTag}</span>
                          <span>${(a.acquisitionCost || a.value || 0).toLocaleString()}</span>
                        </div>
                        <div className="mt-1 font-semibold text-sm">{a.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{a.category?.name || a.category}</div>
                      </div>
                    ))}
                    {stageAssets.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">No {stg.toLowerCase()} assets</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </NeuCard>
    </div>
  );
}

export default AssetsPage;
