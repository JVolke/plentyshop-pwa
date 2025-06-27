<template>
  <div>
    <KrauseSohnBanner />
    <EditablePage :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import KrauseSohnBanner from '~/modules/krausesohn-module/runtime/components/KrauseSohnBanner/KrauseSohnBanner.vue';

definePageMeta({
  middleware: ['confirmation-redirect'],
  pageType: 'static',
});
const { t } = useI18n();
const { setPageMeta } = usePageMeta();
const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');
</script>
