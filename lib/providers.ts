export const PROVIDER_IMAGES: Record<string, string> = {
  eks: '/icons/eks_logo.svg',
  aks: '/icons/azure_logo.svg',
  gce: '/icons/googlecloud_logo.svg',
  openstack: '/icons/openstack_logo.svg',
  minikube: '/icons/minikube_logo.svg',
  k0s: '/icons/k0s_logo.svg',
  alibaba: '/icons/alibaba_logo.svg',
  digitalocean: '/icons/digitalocean_logo.svg',
  openshift: '/icons/openshift_logo.svg',
  aws: '/icons/aws_logo.svg',
};

export function getProviderImage(provider?: string): string | null {
  if (!provider) {
    return null;
  }

  // Normalize provider name to lowercase and try to match
  const normalizedName = provider.toLowerCase().trim();

  // Direct match
  if (PROVIDER_IMAGES[normalizedName]) {
    return PROVIDER_IMAGES[normalizedName];
  }

  // Partial match - check if any key is contained in the provider name
  for (const [key, image] of Object.entries(PROVIDER_IMAGES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return image;
    }
  }

  return null;
}

export function getProviderName(provider?: string): string {
  if (!provider) {
    return 'N/A';
  }

  return provider;
}
