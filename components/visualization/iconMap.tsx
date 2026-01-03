import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';
import { IconProps } from '@/types/misc';
import React from 'react';
import APIServiceIcon from '../svgs/k8s/APIServiceIcon';
import ClusterRoleIcon from '../svgs/k8s/ClusterRoleIcon';
import ConfigMapIcon from '../svgs/k8s/ConfigMapIcon';
import CronJobIcon from '../svgs/k8s/CronJobIcon';
import CSIDriverIcon from '../svgs/k8s/CSIDriverIcon';
import CSINodeIcon from '../svgs/k8s/CSINodeIcon';
import CSIStorageCapacityIcon from '../svgs/k8s/CSIStorageCapacityIcon';
import DaemonSetIcon from '../svgs/k8s/DaemonSetIcon';
import DeploymentIcon from '../svgs/k8s/DeploymentIcon';
import EndpointSliceIcon from '../svgs/k8s/EndpointSliceIcon';
import EndpointsIcon from '../svgs/k8s/EndpointsIcon';
import GroupIcon from '../svgs/k8s/GroupIcon';
import HorizontalPodAutoScalerIcon from '../svgs/k8s/HorizontalPodAutoScalerIcon';
import IngressIcon from '../svgs/k8s/IngressIcon';
import IngressClassIcon from '../svgs/k8s/IngressClassIcon';
import JobIcon from '../svgs/k8s/JobIcon';
import LeaseIcon from '../svgs/k8s/LeaseIcon';
import LimitRangeIcon from '../svgs/k8s/LimitRangeIcon';
import MutatingWebhookConfigurationIcon from '../svgs/k8s/MutatingWebhookConfigurationIcon';
import NamespaceIcon from '../svgs/k8s/NamespaceIcon';
import NetworkAttachmentDefinition from '../svgs/k8s/NetworkAttachmentDefinition';
import NetworkPolicyIcon from '../svgs/k8s/NetworkPolicyIcon';
import NodeIcon from '../svgs/k8s/NodeIcon';
import PersistentVolumeIcon from '../svgs/k8s/PersistentVolumeIcon';
import PersistentVolumeClaimIcon from '../svgs/k8s/PersistentVolumeClaimIcon';
import PodIcon from '../svgs/k8s/PodIcon';
import PodDistributionBudgetIcon from '../svgs/k8s/PodDistributionBudgetIcon';
import PodSecurityPolicyIcon from '../svgs/k8s/PodSecurityPolicyIcon';
import PodTemplateIcon from '../svgs/k8s/PodTemplateIcon';
import PriorityClassIcon from '../svgs/k8s/PriorityClassIcon';
import ReplicaSetIcon from '../svgs/k8s/ReplicaSetIcon';
import ReplicationControllerIcon from '../svgs/k8s/ReplicationControllerIcon';
import ResourceQuotaIcon from '../svgs/k8s/ResourceQuotaIcon';
import RoleIcon from '../svgs/k8s/RoleIcon';
import RoleBindingIcon from '../svgs/k8s/RoleBindingIcon';
import RuntimeClassIcon from '../svgs/k8s/RuntimeClassIcon';
import SecretIcon from '../svgs/k8s/SecretIcon';
import ServiceIcon from '../svgs/k8s/ServiceIcon';
import ServiceAccountIcon from '../svgs/k8s/ServiceAccountIcon';
import StatefulSetIcon from '../svgs/k8s/StatefulSetIcon';
import StorageClassIcon from '../svgs/k8s/StorageClassIcon';
import UserIcon from '../svgs/k8s/UserIcon';
import ValidatingWebhookConfiguration from '../svgs/k8s/ValidatingWebhookConfiguration';
import VerticalPodAutoScalerIcon from '../svgs/k8s/VerticalPodAutoScalerIcon';
import VolumeAttachment from '../svgs/k8s/VolumeAttachment';
import ContainerIcon from '../svgs/k8s/ContainerIcon';
import ClusterRoleBindingIcon from '../svgs/k8s/ClusterRoleBindingIcon';

export type K8sVisualizationIconEnum = Exclude<
  K8sObjectTypeEnum,
  'Cluster' | 'HierarchyGroup' | 'PlaceHolderNamespaceGroup' | 'CWOGroup' | 'PlaceHolderCWOGroup'
>;

const K8sVisualizationIconMap: Record<K8sVisualizationIconEnum, ((props: IconProps) => React.ReactNode) | undefined> = {
  StatefulSet: StatefulSetIcon,
  APIService: APIServiceIcon,
  ClusterRole: ClusterRoleIcon,
  ClusterRoleBinding: ClusterRoleBindingIcon,
  ConfigMap: ConfigMapIcon,
  CronJob: CronJobIcon,
  CSIDriver: CSIDriverIcon,
  CSINode: CSINodeIcon,
  CSIStorageCapacity: CSIStorageCapacityIcon,
  DaemonSet: DaemonSetIcon,
  Deployment: DeploymentIcon,
  EndpointSlice: EndpointSliceIcon,
  Endpoints: EndpointsIcon,
  Group: GroupIcon,
  HorizontalPodAutoscaler: HorizontalPodAutoScalerIcon,
  Ingress: IngressIcon,
  IngressClass: IngressClassIcon,
  Job: JobIcon,
  Lease: LeaseIcon,
  MutatingWebhookConfiguration: MutatingWebhookConfigurationIcon,
  Namespace: NamespaceIcon,
  NetworkAttachmentDefinition: NetworkAttachmentDefinition,
  NetworkPolicy: NetworkPolicyIcon,
  Node: NodeIcon,
  PersistentVolume: PersistentVolumeIcon,
  PersistentVolumeClaim: PersistentVolumeClaimIcon,
  Pod: PodIcon,
  PodDisruptionBudget: PodDistributionBudgetIcon,
  PodSecurityPolicy: PodSecurityPolicyIcon,
  PodTemplate: PodTemplateIcon,
  PriorityClass: PriorityClassIcon,
  ReplicaSet: ReplicaSetIcon,
  ResourceQuota: ResourceQuotaIcon,
  Role: RoleIcon,
  RoleBinding: RoleBindingIcon,
  RuntimeClass: RuntimeClassIcon,
  Secret: SecretIcon,
  Service: ServiceIcon,
  ServiceAccount: ServiceAccountIcon,
  StorageClass: StorageClassIcon,
  User: UserIcon,
  ValidatingWebhookConfiguration: ValidatingWebhookConfiguration,
  VerticalPodAutoscaler: VerticalPodAutoScalerIcon,
  VolumeAttachment: VolumeAttachment,
  Container: ContainerIcon,
  ReplicationController: ReplicationControllerIcon,
  LimitRange: LimitRangeIcon,
  PriorityLevelConfiguration: undefined,
  IngressClassParameters: undefined,
  CNINode: undefined,
  CustomResourceDefinition: undefined,
  Event: undefined,
  TargetGroupBinding: undefined,
  AppProject: undefined,
  ControllerRevision: undefined,
  Application: undefined,
  TokenRequest: undefined,
  LocalSubjectAccessReview: undefined,
  FlowSchema: undefined,
  Binding: undefined,
  ComponentStatus: undefined,
  InitializerConfiguration: undefined,
  TokenReview: undefined,
  SelfSubjectAccessReview: undefined,
  SelfSubjectRulesReview: undefined,
  SubjectAccessReview: undefined,
  BrPolicy: undefined,
  Filesystem: undefined,
  ObjectStore: undefined,
  Pool: undefined,
  CertificateSigningRequest: undefined,
  Volume: undefined,
  PodMetrics: undefined,
  NodeMetrics: undefined,
};

export default K8sVisualizationIconMap;
