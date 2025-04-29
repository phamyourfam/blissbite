import { Modal, TextInput, Textarea, NumberInput, Switch, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from '../features/establishments/establishmentsApi';

interface ProductFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  initialValues?: Partial<ProductFormValues>;
  isEditing?: boolean;
}

export function ProductFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false
}: ProductFormModalProps) {
  const { t } = useTranslation('common');

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: '',
      description: '',
      base_price: 0,
      is_available: true,
      image_url: '',
      preparation_time: undefined,
      ...initialValues
    },
    validate: {
      name: (value) => (!value ? t('common:required') : null),
      base_price: (value) => (value <= 0 ? t('common:invalidPrice') : null)
    }
  });

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? t('product.editTitle') : t('product.createTitle')}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('product.name')}
          placeholder={isEditing ? initialValues?.name : t('product.name')}
          required
          {...form.getInputProps('name')}
        />

        <Textarea
          label={t('product.description')}
          placeholder={isEditing ? initialValues?.description : t('product.description')}
          minRows={3}
          mt="md"
          {...form.getInputProps('description')}
        />

        <NumberInput
          label={t('product.price')}
          placeholder={isEditing ? initialValues?.base_price?.toString() : t('product.price')}
          required
          min={0}
          step={0.01}
          decimalScale={2}
          mt="md"
          {...form.getInputProps('base_price')}
        />

        <TextInput
          label={t('product.imageUrl')}
          placeholder={isEditing ? initialValues?.image_url : t('product.imageUrl')}
          mt="md"
          {...form.getInputProps('image_url')}
        />

        <NumberInput
          label={t('product.preparationTime')}
          placeholder={isEditing ? initialValues?.preparation_time?.toString() : t('product.preparationTime')}
          min={0}
          mt="md"
          {...form.getInputProps('preparation_time')}
        />

        <Switch
          label={t('product.available')}
          mt="md"
          {...form.getInputProps('is_available', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button type="submit">
            {isEditing ? t('common:save') : t('common:create')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 