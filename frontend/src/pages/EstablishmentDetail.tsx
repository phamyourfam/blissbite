import { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  Tabs,
  Card,
  Text,
  TextInput,
  Textarea,
  Grid,
  Image,
  Badge,
  ActionIcon,
  SimpleGrid,
  LoadingOverlay,
  Modal
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { IconArrowLeft, IconEdit, IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { 
  useGetEstablishmentQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateEstablishmentMutation,
  Product,
  ProductFormValues,
  EstablishmentFormValues
} from '../features/establishments/establishmentsApi';
import { ProductFormModal } from '../components/ProductFormModal';
import { notifications } from '@mantine/notifications';

// Component to show a product card with edit/delete options
const ProductCard = ({ 
  product,
  onEdit,
  onDelete
}: { 
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { t } = useTranslation('pages');
  
  return (
    <Card withBorder shadow="sm">
      <Card.Section>
        <Image 
          src={product.image_url || 'https://placehold.co/300x160?text=No+Image'} 
          height={160} 
          alt={product.name}
          fallbackSrc="https://placehold.co/300x160?text=No+Image" 
        />
      </Card.Section>
      
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{product.name}</Text>
        <Badge color={product.is_available ? 'green' : 'gray'}>
          {product.is_available ? t('product.available') : t('product.unavailable')}
        </Badge>
      </Group>
      
      <Text size="sm" c="dimmed" lineClamp={2} mb="sm">
        {product.description}
      </Text>
      
      <Group justify="space-between" mt="md">
        <Text fw={700}>${product.base_price.toFixed(2)}</Text>
        <Group gap={8}>
          <ActionIcon color="blue" onClick={onEdit}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon color="red" onClick={onDelete}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
};

export function EstablishmentDetail({ params }: { params: { id: string } }) {
  const { t } = useTranslation(['pages', 'common']);
  const [, setLocation] = useLocation();
  const { account } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditingEstablishment, setIsEditingEstablishment] = useState(false);
  const [establishmentForm, setEstablishmentForm] = useState<EstablishmentFormValues>({
    name: '',
    address: '',
    description: '',
    status: 'active'
  });

  const { data: establishment, isLoading: isLoadingEstablishment } = useGetEstablishmentQuery(params.id);
  const { data: products = [], isLoading: isLoadingProducts } = useGetProductsQuery(params.id);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateEstablishment] = useUpdateEstablishmentMutation();
  
  // Redirect if not a professional account
  if (account?.accountType !== 'PROFESSIONAL') {
    setLocation('/settings');
    return null;
  }

  if (isLoadingEstablishment || !establishment) {
    return (
      <Container>
        <LoadingOverlay visible />
      </Container>
    );
  }

  const handleCreateProduct = async (values: ProductFormValues) => {
    try {
      await createProduct({ establishmentId: params.id, data: values }).unwrap();
      notifications.show({
        title: t('common:success'),
        message: t('product.createdSuccess'),
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

  const handleEditProduct = async (values: ProductFormValues) => {
    if (editingProduct) {
      try {
        await updateProduct({
          establishmentId: params.id,
          productId: editingProduct.id,
          data: values
        }).unwrap();
        notifications.show({
          title: t('common:success'),
          message: t('product.updatedSuccess'),
          color: 'green'
        });
        setEditingProduct(null);
      } catch (error) {
        notifications.show({
          title: t('common:error'),
          message: t('product.updateError'),
          color: 'red'
        });
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm(t('product.confirmDelete'))) {
      try {
        await deleteProduct({ establishmentId: params.id, productId }).unwrap();
        notifications.show({
          title: t('common:success'),
          message: t('product.deletedSuccess'),
          color: 'green'
        });
      } catch (error) {
        notifications.show({
          title: t('common:error'),
          message: t('product.deleteError'),
          color: 'red'
        });
      }
    }
  };

  const handleEstablishmentEdit = () => {
    if (establishment) {
      setEstablishmentForm({
        name: establishment.name,
        address: establishment.address,
        description: establishment.description || '',
        status: establishment.status
      });
      setIsEditingEstablishment(true);
    }
  };

  const handleEstablishmentSave = async () => {
    try {
      await updateEstablishment({
        id: params.id,
        data: establishmentForm
      }).unwrap();
      notifications.show({
        title: t('common:success'),
        message: t('establishment.updatedSuccess'),
        color: 'green'
      });
      setIsEditingEstablishment(false);
    } catch (error) {
      notifications.show({
        title: t('common:error'),
        message: t('establishment.updateError'),
        color: 'red'
      });
    }
  };
  
  return (
    <Container>
      <Group mb="md">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={14} />}
          onClick={() => setLocation('/establishments')}
        >
          {t('common:back')}
        </Button>
        <Title order={2}>{establishment.name}</Title>
      </Group>
      
      <Tabs defaultValue="details">
        <Tabs.List>
          <Tabs.Tab value="details">{t('establishment.tabs.details', 'Establishment Details')}</Tabs.Tab>
          <Tabs.Tab value="products">{t('establishment.tabs.products', 'Products')}</Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="details" pt="md">
          <Card withBorder p="lg">
            <Group justify="space-between" mb="md">
              <Title order={3}>{t('establishment.details.title', 'Establishment Details')}</Title>
              {!isEditingEstablishment && (
                <Button
                  leftSection={<IconEdit size={16} />}
                  onClick={handleEstablishmentEdit}
                >
                  {t('establishment.details.edit', 'Edit Details')}
                </Button>
              )}
            </Group>
            
            <SimpleGrid cols={2}>
              <TextInput
                label={t('establishment.details.name', 'Name')}
                value={isEditingEstablishment ? establishmentForm.name : establishment.name}
                onChange={(e) => setEstablishmentForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditingEstablishment}
              />
              
              <TextInput
                label={t('establishment.details.address', 'Address')}
                value={isEditingEstablishment ? establishmentForm.address : establishment.address}
                onChange={(e) => setEstablishmentForm(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditingEstablishment}
              />
            </SimpleGrid>
            
            <Textarea
              label={t('establishment.details.description', 'Description')}
              value={isEditingEstablishment ? establishmentForm.description : (establishment.description || '')}
              onChange={(e) => setEstablishmentForm(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditingEstablishment}
              mt="md"
            />
            
            {isEditingEstablishment && (
              <Group justify="flex-end" mt="xl">
                <Button
                  variant="default"
                  onClick={() => setIsEditingEstablishment(false)}
                >
                  {t('common:cancel')}
                </Button>
                <Button
                  leftSection={<IconCheck size={16} />}
                  onClick={handleEstablishmentSave}
                >
                  {t('common:save')}
                </Button>
              </Group>
            )}
          </Card>
        </Tabs.Panel>
        
        <Tabs.Panel value="products" pt="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>{t('establishment.products.title', 'Products')}</Title>
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('establishment.products.add', 'Add Product')}
            </Button>
          </Group>
          
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoadingProducts} />
            <Grid>
              {products.map(product => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <ProductCard 
                    product={product}
                    onEdit={() => setEditingProduct(product)}
                    onDelete={() => handleDeleteProduct(product.id)}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        </Tabs.Panel>
      </Tabs>

      <ProductFormModal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <ProductFormModal
        opened={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleEditProduct}
        initialValues={editingProduct ? {
          name: editingProduct.name,
          description: editingProduct.description,
          base_price: editingProduct.base_price,
          is_available: editingProduct.is_available,
          image_url: editingProduct.image_url,
          preparation_time: editingProduct.preparation_time
        } : undefined}
        isEditing
      />
    </Container>
  );
} 