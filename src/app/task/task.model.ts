export enum Status{
  TO_DO,IN_PROGRESS,DONE
}

export interface Task{
  id:number;
  title:string;
  status: Status;
  description:string;
  priority: number;
}
