interface Props {
  email?: string;
  rut?: string;
  address?: string;
  role?: string;
}

export default function UserInfoGrid({ email, rut, address, role }: Props) {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase text-slate-500">Correo</p>
        <p className="mt-1 font-medium text-slate-800">{email}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase text-slate-500">RUT</p>
        <p className="mt-1 font-medium text-slate-800">{rut}</p>
      </div>
      {role && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Tipo de cuenta</p>
          <p className="mt-1 font-medium text-slate-800">{role}</p>
        </div>
      )}
      <div className={`rounded-xl border border-slate-200 bg-white p-4 ${role ? "" : "sm:col-span-2"}`}>
        <p className="text-xs uppercase text-slate-500">Dirección</p>
        <p className="mt-1 font-medium text-slate-800">{address}</p>
      </div>
    </section>
  );
}
