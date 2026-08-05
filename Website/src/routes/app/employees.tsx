import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { NeuCard, PageHeader, Badge, ViewModeSwitcher, type ViewMode } from "@/components/layout/ui";
import { toast } from "sonner";
import { employeesApi, departmentsApi } from "@/lib/api";

function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, departmentsData] = await Promise.all([
          employeesApi.getAll(),
          departmentsApi.getAll(),
        ]);
        setEmployees(employeesData.employees || []);
        setDepartments(departmentsData.departments || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDepartmentName = (u: any) => {
    if (!u) return "IT";
    const dept = u.department;
    if (!dept) return "IT";
    if (typeof dept === "object" && dept.name) return dept.name;
    const found = departments.find((d: any) => d._id === dept || d.id === dept || d.code === dept || d.name === dept);
    if (found) return found.name;
    if (typeof dept === "string" && dept.length < 20 && !dept.includes("66a")) return dept;
    return "IT";
  };

  const renderRoleBadge = (role: string = "employee") => {
    const r = role.toLowerCase();
    if (r === "admin") return <Badge tone="primary">Admin</Badge>;
    if (r === "asset_manager") return <Badge tone="success">Asset Manager</Badge>;
    if (r === "department_head") return <Badge tone="warn">Dept Head</Badge>;
    return <Badge tone="neutral">Employee</Badge>;
  };

  const handleCreateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      
      await employeesApi.create(data);
      toast.success("Employee created successfully");
      setShowForm(false);
      // Refresh employees
      const employeesData = await employeesApi.getAll();
      setEmployees(employeesData.employees || []);
    } catch (error: any) {
      console.error('Failed to create employee:', error);
      toast.error(error.message || "Failed to create employee");
    }
  };

  const ROLES = ["admin", "asset_manager", "department_head", "employee"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Promote employees, manage roles, and view assignments."
        actions={
          <>
            <ViewModeSwitcher viewMode={viewMode} onViewChange={setViewMode} />
            <button onClick={() => setShowForm((v) => !v)} className="neu-accent inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              <UserPlus className="h-4 w-4" /> Invite employee
            </button>
          </>
        }
      />

      {showForm && (
        <NeuCard>
          <h3 className="mb-4 text-lg font-semibold">Invite new employee</h3>
          <form
            onSubmit={handleCreateEmployee}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {[
              { l: "First name", p: "John", n: "firstName" },
              { l: "Last name", p: "Doe", n: "lastName" },
              { l: "Email", p: "john@example.com", n: "email", type: "email" },
              { l: "Password", p: "Password123", n: "password", type: "password" },
              { l: "Phone", p: "+1234567890", n: "phone" },
              { l: "Designation", p: "Software Engineer", n: "designation" },
              { l: "Department", p: "Select department", n: "department", isSelect: true, options: departments },
              { l: "Role", p: "employee", n: "role" },
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
              <button type="submit" className="neu-accent rounded-xl px-4 py-2.5 text-sm font-semibold">Invite employee</button>
            </div>
          </form>
        </NeuCard>
      )}

      <NeuCard>
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Loading employees...</div>
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 pr-3">Employee</th>
                  <th className="py-3 pr-3">Email</th>
                  <th className="py-3 pr-3">Department</th>
                  <th className="py-3 pr-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((u: any) => (
                  <tr key={u._id} className="border-t border-border/50 hover:bg-muted/30">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                          {u.firstName && u.lastName ? `${u.firstName[0]}${u.lastName[0]}` : (u.name ? u.name.slice(0, 2).toUpperCase() : 'NA')}
                        </div>
                        <span className="font-medium">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3 pr-3 font-medium text-foreground">{getDepartmentName(u)}</td>
                    <td className="py-3 pr-3">
                      {renderRoleBadge(u.role)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {employees.map((u: any) => (
              <div key={u._id} className="neu-inset flex flex-col justify-between rounded-xl p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {u.firstName && u.lastName ? `${u.firstName[0]}${u.lastName[0]}` : (u.name ? u.name.slice(0, 2).toUpperCase() : 'NA')}
                    </div>
                    {renderRoleBadge(u.role)}
                  </div>
                  <h4 className="mt-3 text-base font-semibold">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.name}</h4>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{getDepartmentName(u)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Kanban View by Role */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((roleKey) => {
              const roleEmployees = employees.filter((u) => (u.role || "employee").toLowerCase() === roleKey.toLowerCase());
              return (
                <div key={roleKey} className="neu rounded-xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      {roleKey.replace("_", " ")}
                    </span>
                    {renderRoleBadge(roleKey)}
                  </div>
                  <div className="space-y-3">
                    {roleEmployees.map((u: any) => (
                      <div key={u._id} className="neu-inset rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                            {u.firstName && u.lastName ? `${u.firstName[0]}${u.lastName[0]}` : (u.name ? u.name.slice(0, 2).toUpperCase() : 'NA')}
                          </div>
                          <span className="font-medium text-xs truncate">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.name}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{getDepartmentName(u)}</span>
                        </div>
                      </div>
                    ))}
                    {roleEmployees.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">No {roleKey.replace("_", " ")}s</div>
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

export default EmployeesPage;
