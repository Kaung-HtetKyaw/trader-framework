import Breadcrumbs from '../Breadcrumbs';
import HeaderWrapper from './HeaderWrapper';

const ClusterInfoHeader = () => {
  return (
    <HeaderWrapper>
      <section className="bg-white md:px-4 py-4 flex flex-row items-center justify-center gap-3">
        <Breadcrumbs />
      </section>
    </HeaderWrapper>
  );
};

export default ClusterInfoHeader;
