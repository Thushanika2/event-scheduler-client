"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Session } from "@/types/session"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SessionListView() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!sessionToDelete) return
    setIsDeleting(true)
    try {
      await axios.delete(
        `http://127.0.0.1:5000/api/sessions/${sessionToDelete.session_id}`
      )
      toast.success(`Session "${sessionToDelete.title}" deleted successfully!`)
      setSessionToDelete(null)
      fetchSessions()
    } catch (error) {
      console.error("Error deleting session:", error)
      toast.error("Failed to delete session.")
    } finally {
      setIsDeleting(false)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/sessions"
      )
      setSessions(response.data.sessions)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/sessions")
      .then((response) => {
        setSessions(response.data.sessions)
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error)
      })
  }, [])

  return (
    <div className="p-6">
      <Link
        href="/"
        className="mb-4 inline-block text-blue-500 hover:underline"
      >
        &larr; Back to Home
      </Link>
      <Table>
        <TableCaption>A list of sessions fetched from the API.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">CGPA</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.session_id}>
              <TableCell>{session.room_id}</TableCell>
              <TableCell>{session.title}</TableCell>
              <TableCell>{session.speaker}</TableCell>
              <TableCell>{session.date}</TableCell>
              <TableCell>{session.start_time}</TableCell>
              <TableCell>{session.end_time}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3 items-center">
                  <Link
                    href={`/sessions/${session.session_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  
                  <button
                    onClick={() => setSessionToDelete(session)}
                    className="text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-0 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={!!sessionToDelete}
        onOpenChange={(open) => {
          if (!open) setSessionToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete session{" "}
              <strong className="text-foreground font-semibold">
                {sessionToDelete?.title}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setSessionToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
