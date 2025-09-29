import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Phone, Edit, Trash2 } from "lucide-react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";

export default function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [reservedTables, setReservedTables] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Dinamik olarak render edilen table field
  const tableField = {
    id: 5,
    label: "Table",
    name: "table_number",
    type: "select",
    isRequired: true,
    selectItems: availableTables
      .filter((t) => !reservedTables.includes(t.number))
      .map((t) => ({
        id: t.id,
        value: t.number,
        label: `Masa ${t.number} (${t.capacity} seats)`,
      })),
  };

  // Form alanları
  const fields = [
    {
      id: 0,
      label: "Customer Name",
      name: "customer",
      type: "text",
      placeholder: "Enter customer name",
      isRequired: true,
    },
    {
      id: 1,
      label: "Phone",
      name: "phone",
      type: "text",
      placeholder: "Enter phone number",
      isRequired: true,
    },
    {
      id: 2,
      label: "Date",
      name: "date",
      type: "date",
      isRequired: true,
    },
    {
      id: 3,
      label: "Time",
      name: "time",
      type: "time",
      isRequired: true,
    },
    {
      id: 4,
      label: "Guests",
      name: "guests",
      type: "number",
      placeholder: "Number of guests",
      isRequired: true,
    },
    tableField,
    {
      id: 6,
      label: "Status",
      name: "status",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: "Pending", label: "Pending" },
        { id: 1, value: "Confirmed", label: "Confirmed" },
        { id: 2, value: "Seated", label: "Seated" },
        { id: 3, value: "Cancelled", label: "Cancelled" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Seated":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  async function fetchReservations() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: true });
    if (!error) setReservations(data || []);
    else console.error(error);
  }

  async function fetchAvailableTables() {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("status", "Available");
    if (!error) setAvailableTables(data || []);
    else console.error(error);
  }

  async function fetchReservedTables(date: string, time: string) {
    if (!date || !time) return;

    const { data, error } = await supabase
      .from("reservations")
      .select("table_number")
      .eq("reservation_date", date)
      .eq("time", time);

    if (!error && data) {
      const reserved = data.map((r) => r.table_number);
      setReservedTables(reserved);
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (selectedTime) fetchReservedTables(date, selectedTime);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) fetchReservedTables(selectedDate, time);
  };

  async function handleSave(data: any) {
    const insertData = {
      customer: data.customer,
      phone: data.phone,
      reservation_date: data.date,
      time: data.time,
      guests: data.guests,
      table_number: data.table_number,
      status: data.status,
    };

    if (data.id) {
      const { error } = await supabase
        .from("reservations")
        .update(insertData)
        .eq("id", data.id);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from("reservations").insert([insertData]);
      if (error) return alert(error.message);
    }

    await fetchReservations();
    setModalOpen(false);
    setActiveReservation({});
  }

  async function handleEdit(reservation: any) {
    setActiveReservation(reservation);
    setModalOpen(true);
    if (reservation.reservation_date && reservation.time) {
      setSelectedDate(reservation.reservation_date);
      setSelectedTime(reservation.time);
      fetchReservedTables(reservation.reservation_date, reservation.time);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) return alert(error.message);
    await fetchReservations();
  }

  useEffect(() => {
    fetchReservations();
    fetchAvailableTables();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Reservations</h1>
                <p className="text-muted-foreground">Manage table reservations</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setActiveReservation({});
                setModalOpen(true);
                const today = new Date().toISOString().split("T")[0];
                setSelectedDate(today);
                setSelectedTime("12:00");
                fetchReservedTables(today, "12:00");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reservation
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{reservation.customer}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {reservation.phone}
                      </div>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{reservation.reservation_date}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Time:</span> {reservation.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{reservation.guests} guests</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Table:</span> {reservation.table_number}</div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(reservation)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(reservation.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <UpdateDataForm
        initialData={activeReservation}
        fields={fields}
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />
    </SidebarProvider>
  );
}
