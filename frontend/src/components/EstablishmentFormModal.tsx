import { Modal, TextInput, Textarea, Button, Group, Stack, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { EstablishmentFormValues } from '../features/establishments/establishmentsApi';

interface EstablishmentFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: EstablishmentFormValues) => void;
  initialValues?: EstablishmentFormValues;
  isEditing?: boolean;
}

export function EstablishmentFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false
}: EstablishmentFormModalProps) {
  const { t } = useTranslation(['common', 'establishments']);

  const form = useForm<EstablishmentFormValues>({
    initialValues: initialValues || {
      name: '',
      address: '',
      description: '',
      status: 'active'
    },
    validate: {
      name: (value) => (!value ? t('common:required') : null),
      address: (value) => (!value ? t('common:required') : null),
      status: (value) => (!value ? t('common:required') : null)
    }
  });

  const handleSubmit = (values: EstablishmentFormValues) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? t('establishments:editEstablishment') : t('establishments:addEstablishment')}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label={t('establishments:name')}
            placeholder={t('establishments:namePlaceholder')}
            {...form.getInputProps('name')}
          />

          <TextInput
            label={t('establishments:address')}
            placeholder={t('establishments:addressPlaceholder')}
            {...form.getInputProps('address')}
          />

          <Textarea
            label={t('establishments:description')}
            placeholder={t('establishments:descriptionPlaceholder')}
            {...form.getInputProps('description')}
          />

          <Select
            label={t('establishments:status')}
            data={[
              { value: 'active', label: t('establishments:active') },
              { value: 'inactive', label: t('establishments:inactive') }
            ]}
            {...form.getInputProps('status')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              {t('common:cancel')}
            </Button>
            <Button type="submit">
              {isEditing ? t('common:save') : t('common:create')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 