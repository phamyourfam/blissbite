import { useState } from 'react';
import { Container, Title, Grid, Card, Text, Button, Group, Badge, ActionIcon, LoadingOverlay } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { IconArrowLeft, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { EstablishmentFormModal } from '../components/EstablishmentFormModal';
import { 
  useGetEstablishmentsQuery,
  useCreateEstablishmentMutation,
  useUpdateEstablishmentMutation,
  useDeleteEstablishmentMutation,
  Establishment,
  EstablishmentFormValues
} from '../features/establishments/establishmentsApi';
import { notifications } from '@mantine/notifications';

export function Establishments() {
  const { t } = useTranslation(['pages', 'common', 'establishments']);
  const [, setLocation] = useLocation();
  const { account } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);

  const { data: response, isLoading } = useGetEstablishmentsQuery({ page: 1, limit: 10 });
  const establishments = response?.establishments || [];
  const [createEstablishment] = useCreateEstablishmentMutation();
  const [updateEstablishment] = useUpdateEstablishmentMutation();
  const [deleteEstablishment] = useDeleteEstablishmentMutation();

  // Redirect if not a professional account
  if (account?.accountType !== 'PROFESSIONAL') {
    setLocation('/settings');
    return null;
  }

  const handleEstablishmentClick = (id: string) => {
    setLocation(`/establishments/${id}`);
  };

  const handleCreate = async (values: EstablishmentFormValues) => {
    try {
      await createEstablishment(values).unwrap();
      notifications.show({
        title: t('establishments:success'),
        message: t('establishments:createdSuccess'),
        color: 'green'
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      notifications.show({
        title: t('common:error'),
        message: t('common:errorOccurred'),
        color: 'red'
      });
    }
  };

  const handleEdit = async (values: EstablishmentFormValues) => {
    if (editingEstablishment) {
      try {
        await updateEstablishment({ id: editingEstablishment.id, data: values }).unwrap();
        notifications.show({
          title: t('establishments:success'),
          message: t('establishments:updatedSuccess'),
          color: 'green'
        });
        setEditingEstablishment(null);
      } catch (error) {
        notifications.show({
          title: t('common:error'),
          message: t('establishments:updateError'),
          color: 'red'
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('establishments:confirmDelete'))) {
      try {
        await deleteEstablishment(id).unwrap();
        notifications.show({
          title: t('establishments:success'),
          message: t('establishments:deletedSuccess'),
          color: 'green'
        });
      } catch (error) {
        notifications.show({
          title: t('common:error'),
          message: t('establishments:deleteError'),
          color: 'red'
        });
      }
    }
  };

  return (
    <Container>
      <Group mb="md" justify="space-between">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={14} />}
            onClick={() => setLocation('/')}
          >
            {t('common:back')}
          </Button>
          <Title order={2}>{t('establishments.title', 'Your Establishments')}</Title>
        </Group>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('establishments.add', 'Add Establishment')}
        </Button>
      </Group>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={isLoading} />
        <Grid>
          {establishments.map((establishment) => (
            <Grid.Col key={establishment.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card withBorder shadow="sm" padding="lg">
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{establishment.name}</Text>
                  <Badge 
                    color={establishment.status === 'active' ? 'green' : 'gray'}
                  >
                    {establishment.status}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  {establishment.address}
                </Text>
                
                <Text size="sm" mb="md">
                  {t('establishments.products', '{{count}} Products', { count: establishment.productsCount })}
                </Text>
                
                <Group justify="space-between">
                  <Button 
                    variant="light" 
                    onClick={() => handleEstablishmentClick(establishment.id)}
                  >
                    {t('establishments.manage', 'Manage')}
                  </Button>
                  <Group gap={8}>
                    <ActionIcon 
                      color="blue"
                      onClick={() => setEditingEstablishment(establishment)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      color="red"
                      onClick={() => handleDelete(establishment.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>

      <EstablishmentFormModal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <EstablishmentFormModal
        opened={!!editingEstablishment}
        onClose={() => setEditingEstablishment(null)}
        onSubmit={handleEdit}
        initialValues={editingEstablishment ? {
          name: editingEstablishment.name,
          address: editingEstablishment.address,
          description: editingEstablishment.description,
          status: editingEstablishment.status
        } : undefined}
        isEditing
      />
    </Container>
  );
} 