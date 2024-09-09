export enum ProgressStatus{
  TO_DO,IN_PROGRESS,DONE
}

export interface Task{
  id:number;
  title:string;
  status: ProgressStatus;
  description:string;
  priority: number;
}
