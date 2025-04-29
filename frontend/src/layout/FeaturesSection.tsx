import { useTranslation } from 'react-i18next';
import { Grid, Card, Text, Title, Center, Box, Stack } from "@mantine/core";
import { IconZoomIn, IconChartBar, IconCircle, IconHandFinger, IconLayersSubtract, IconBell } from "@tabler/icons-react";
import classes from "./Features.module.css";

const reasons = [
  {
    title: "Quality",
    description: "We deliver exceptional results that exceed expectations, setting new standards in the industry.",
    icon: <IconZoomIn size={24} />,
  },
  {
    title: "Experience",
    description: "Decades of combined expertise ensures your project is handled with professional excellence.",
    icon: <IconChartBar size={24} />,
  },
  {
    title: "Support",
    description: "24/7 dedicated support team ready to assist you with any questions or concerns.",
    icon: <IconCircle size={24} />,
  },
  {
    title: "Innovation",
    description: "Cutting-edge solutions that keep you ahead of the curve in today's dynamic market.",
    icon: <IconHandFinger size={24} />,
  },
  {
    title: "Results",
    description: "Proven track record of delivering measurable outcomes and tangible business value.",
    icon: <IconLayersSubtract size={24} />,
  },
  {
    title: "Efficiency",
    description: "Streamlined processes that save time and resources while maximizing productivity.",
    icon: <IconBell size={24} />,
  },
];

export const FeaturesSection = () => {
  const { t } = useTranslation(['pages', 'common']);

  return (
    <Box py={120} className={classes.wrapper}>
      <Box px="md" mx="auto" maw={1200}>
        <Stack gap={60}>
          <Box>
            <Title className={classes.title} order={2} ta="center" size={40} fw={800}>
              {t('landing.features.title')}
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={600} mx="auto" mt="md">
              {t('landing.features.description')}
            </Text>
          </Box>

          <Grid gutter={40}>
            {reasons.map((reason, i) => (
              <Grid.Col key={i} span={{ base: 12, md: 6, lg: 4 }}>
                <Card className={classes.card} p={30} radius="md" withBorder>
                  <Stack gap="lg">
                    <Center>
                      <Box className={classes.iconWrapper}>{reason.icon}</Box>
                    </Center>
                    <Stack gap="sm">
                      <Text className={classes.cardTitle}>{reason.title}</Text>
                      <Text size="md" c="dimmed" lh={1.6}>
                        {reason.description}
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};