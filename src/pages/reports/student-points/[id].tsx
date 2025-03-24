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
  CircularProgress,
} from '@mui/material';
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
      <Paper style={{ padding: 16, marginBottom: 24 }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='h5'>{student.first_name}</Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              Filial: {student.branches.map(branch => branch.name).join(', ')}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {student.phone}
            </Typography>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Box display="flex" gap={4} alignItems={'center'}>
              <Typography variant='h4' style={{ fontWeight: 'bold' }}>
                {student.total_points}
              </Typography>
              <span>Jami ballar</span>
            </Box>
            <Typography variant='h6' color='textSecondary'>
              O'rin: {student.rank}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant='h6'>Ballar tarixi</Typography>
        <Box style={{ display: 'flex', gap: 8 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            disabled={isCreating}
            onClick={() => setOpenAddModal(true)}
          >
            Ball qo'shish
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sana</TableCell>
              <TableCell>Ball</TableCell>
              <TableCell>Tavsif</TableCell>
              <TableCell>Kim tomonidan</TableCell>
              <TableCell align='right'>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.points.length > 0 ? (
              student.points.map(point => (
                <TableRow key={point.id}>
                  <TableCell>{point.created_at ? new Date(point.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{point.point}</TableCell>
                  <TableCell>{point.description}</TableCell>
                  <TableCell>{point.created_by}</TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' color='primary' onClick={() => handleEditClick(point)}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDeleteClick(point)}>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Ball tranzaksiyalari topilmadi
                </TableCell>
              </TableRow>
            )}
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
          <Button onClick={() => setOpenEditModal(false)} disabled={isUpdating}>
            Bekor qilish
          </Button>
          <Button onClick={handleEditSave} variant='contained' disabled={isUpdating}>
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
    </Box>
  )
};

StudentPointsDetailPages.displayName = 'StudentPointsDetailPages';
export default StudentPointsDetailPages;
