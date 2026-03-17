"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface Encargado {
  id: number
  nombre: string
  apellido: string
  hora_entrada: string
  hora_salida: string
}

export default function EncargadosPage() {
  const [encargados, setEncargados] = useState<Encargado[]>([])
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [horaEntrada, setHoraEntrada] = useState("")
  const [horaSalida, setHoraSalida] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchEncargados()
  }, [])

  async function fetchEncargados() {
    const { data, error } = await supabase
      .from("encargados")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setEncargados(data || [])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !horaEntrada || !horaSalida) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from("encargados").insert([
      {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
      },
    ])

    if (error) {
      setMessage({ type: "error", text: "Error al guardar el encargado" })
    } else {
      setMessage({ type: "success", text: "Encargado guardado correctamente" })
      setNombre("")
      setApellido("")
      setHoraEntrada("")
      setHoraSalida("")
      fetchEncargados()
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("encargados").delete().eq("id", id)
    if (!error) {
      setMessage({ type: "success", text: "Encargado eliminado" })
      fetchEncargados()
    } else {
      setMessage({ type: "error", text: "Error al eliminar el encargado" })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <PageHeader 
          title="Encargados" 
          description="Registra el personal encargado con sus horarios"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Encargado</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Juan"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Ej: Pérez"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaEntrada">Hora de Entrada</Label>
                    <Input
                      id="horaEntrada"
                      type="time"
                      value={horaEntrada}
                      onChange={(e) => setHoraEntrada(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaSalida">Hora de Salida</Label>
                    <Input
                      id="horaSalida"
                      type="time"
                      value={horaSalida}
                      onChange={(e) => setHoraSalida(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message.text}
                  </p>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Encargado"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Encargados Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {encargados.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay encargados registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellido</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead className="w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {encargados.map((encargado) => (
                      <TableRow key={encargado.id}>
                        <TableCell className="font-medium">{encargado.nombre}</TableCell>
                        <TableCell>{encargado.apellido}</TableCell>
                        <TableCell>{encargado.hora_entrada}</TableCell>
                        <TableCell>{encargado.hora_salida}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(encargado.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
