'use client'

import { FC, useEffect, useState } from 'react';
import { useDelete, useGet, usePatch, usePost } from 'src/hooks/useApi'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress, Chip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast'

interface Branch {
  id: number;
  name: string;
}

interface Point {
  id: number;
  user: number;
  point: number;
  description: string;
  created_by: string;
  created_at?: string;
}

interface Student {
  id: number;
  first_name: string;
  phone: string;
  total_points: number;
  rank: number;
  points: Point[];
  branches: Branch[];
}

interface ApiResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: Student[];
}

const StudentPointsDetailPages: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, refetch } = useGet<ApiResponse>('student/points/', {
    params: { student: id },
  });
  const { mutate: updatePoint, isPending: isUpdating } = usePatch();
  const { mutate: postPoint, isPending: isCreating } = usePost();
  const { mutate: deletePoint, isPending: isDeleting } = useDelete();

  const [student, setStudent] = useState<Student | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [editFormData, setEditFormData] = useState({
    point: 0,
    description: ''
  });
  const [addFormData, setAddFormData] = useState({
    point: 0,
    description: ''
  });

  useEffect(() => {
    if (data && data.results.length > 0) {
      setStudent(data.results[0]);
    }
  }, [data]);

  const handleEditClick = (point: Point) => {
    setCurrentPoint(point);
    setEditFormData({
      point: point.point,
      description: point.description
    });
    setOpenEditModal(true);
  };

  const handleDeleteClick = (point: Point) => {
    setCurrentPoint(point);
    setOpenDeleteModal(true);
  };

  const handleEditSave = () => {
    if (!currentPoint) return;

    updatePoint(`student/point/${currentPoint.id}`, {
      user: Number(id),
      point: editFormData.point,
      description: editFormData.description,
      onSuccess: () => {
        void refetch()
        toast.success('Ball muvaffaqiyatli yangilandi')
        setOpenEditModal(false)
      },
      onError: (error: any) => {
        console.error('Error updating point:', error)
        toast.error('Xatolik yuz berdi')
      }
    })
  };

  const handleAddSave = () => {
    if (!student || !id) return;

    postPoint('student/point/', {
      user: Number(id),
      point: addFormData.point,
      description: addFormData.description,
      onSuccess: () => {
        void refetch()

        toast.success("Yangi ball muvaffaqiyatli qo'shildi")
        setAddFormData({ point: 0, description: '' })
        setOpenAddModal(false)
      },
      onError: (error: any) => {
        console.error('Error adding point:', error)
        toast.error('Xatolik yuz berdi')
      }
    })
  };

  const handleDelete = () => {
    if (!currentPoint) return;

    deletePoint(
      `student/point/${currentPoint.id}`,
      {
        onSuccess: () => {
          void refetch();
          toast.success('Ball muvaffaqiyatli o\'chirildi');
          setOpenDeleteModal(false);
        },
        onError: (error) => {
          console.error('Error deleting point:', error);
          toast.error('Xatolik yuz berdi');
        }
      }
    );
  };

  if (!id) {
    return <Box style={{ padding: 20 }}>Waiting for route parameters...</Box>;
  }

  if (isLoading || !student) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ padding: 16 }}>
      <Paper
        style={{
          padding: 24,
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          background: '#fff'
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <Box>
            <Typography variant='h4' style={{ fontWeight: 600, marginBottom: 8 }}>
              {student.first_name}
            </Typography>
            <Typography style={{ color: '#666', marginBottom: 4 }}>
              Filial: {student.branches.map(branch => branch.name).join(', ')}
            </Typography>
            <Typography style={{ color: '#666' }}>Telefon raqami: {student.phone}</Typography>
          </Box>

          <Box style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: 8 }}>
              <Typography
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#666cff',
                  lineHeight: 1
                }}
              >
                {student.total_points}
              </Typography>
              <Typography style={{ color: '#666' }}>Jami ballar</Typography>
            </div>
            <Chip variant='outlined' color='primary' label={`O'rin: ${student.rank}`} />
          </Box>
        </Box>
      </Paper>

      <Box
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16
        }}
      >
        <Typography variant='h5' style={{ fontWeight: 600 }}>
          Ballar tarixi
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          disabled={isCreating}
          onClick={() => setOpenAddModal(true)}
          style={{
            minWidth: 160,
            borderRadius: 8,
            textTransform: 'none'
          }}
        >
          Ball qo'shish
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        style={{
          borderRadius: 12,
          border: '1px solid #eee',
          overflowX: 'auto'
        }}
      >
        <Table style={{ minWidth: 600 }}>
          <TableHead style={{ background: '#f5f5f5' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 600 }}>Sana</TableCell>
              <TableCell style={{ fontWeight: 600 }}>Ball</TableCell>
              <TableCell style={{ fontWeight: 600 }}>Tavsif</TableCell>
              <TableCell style={{ fontWeight: 600 }}>Kim tomonidan</TableCell>
              <TableCell align='right' style={{ fontWeight: 600 }}>
                Amallar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.points.map(point => (
              <TableRow key={point.id} style={{ borderBottom: '1px solid #eee' }}>
                <TableCell>{point.created_at ? new Date(point.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{point.point}</TableCell>
                <TableCell style={{ maxWidth: 300 }}>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {point.description}
                  </div>
                </TableCell>
                <TableCell>{point.created_by}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => handleEditClick(point)}
                    style={{ marginRight: 8 }}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDeleteClick(point)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Ballni tahrirlash</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Ball miqdori'
            type='number'
            value={editFormData.point}
            onChange={e => setEditFormData({ ...editFormData, point: Number(e.target.value) })}
            margin='normal'
            style={{ marginBottom: 16 }}
          />
          <TextField
            fullWidth
            label='Tavsif'
            multiline
            rows={3}
            value={editFormData.description}
            onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: 8
            }}
            onClick={() => setOpenEditModal(false)}
            disabled={isUpdating}
          >
            Bekor qilish
          </Button>
          <Button
            style={{
              borderRadius: 8,
              color: 'white',
              marginLeft: 12
            }}
            onClick={handleEditSave}
            variant='contained'
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Saqlash'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Yangi ball qo'shish</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Ball miqdori'
            type='number'
            value={addFormData.point}
            onChange={e => setAddFormData({ ...addFormData, point: Number(e.target.value) })}
            margin='normal'
          />
          <TextField
            fullWidth
            label='Tavsif'
            multiline
            rows={3}
            value={addFormData.description}
            onChange={e => setAddFormData({ ...addFormData, description: e.target.value })}
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)} disabled={isUpdating}>
            Bekor qilish
          </Button>
          <Button onClick={handleAddSave} variant='contained' disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : "Qo'shish"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Ballni o'chirish</DialogTitle>
        <DialogContent>
          <Typography>Haqiqatan ham bu ballni o'chirmoqchimisiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} disabled={isDeleting}>
            Bekor qilish
          </Button>
          <Button onClick={handleDelete} color='error' variant='contained' disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : "O'chirish"}
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Box>
  )
};

StudentPointsDetailPages.displayName = 'StudentPointsDetailPages';
export default StudentPointsDetailPages;
