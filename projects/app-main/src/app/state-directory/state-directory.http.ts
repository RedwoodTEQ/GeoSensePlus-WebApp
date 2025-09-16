export interface PointData {
  id: number;
  name: string;
}

export interface GroupData
{
  id: number;
  name: string;
  children?: GroupData[];
  points?: PointData[];
  isExpanded: boolean;
}