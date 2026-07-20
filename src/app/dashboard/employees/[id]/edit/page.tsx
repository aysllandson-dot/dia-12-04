import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EmployeeForm from "@/components/employees/EmployeeForm";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <EmployeeForm initialData={employee} employeeId={id} />
    </div>
  );
}
