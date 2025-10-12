// Dashboard feature exports

// Dashboard actions
export { getBoards } from "./actions/board-actions";
export { BoardGridSkeleton } from "./components/board-grid-skeleton";
export { BoardList } from "./components/board-list";
export { CreateBoardDialog } from "./components/create-board-dialog";
export { DashboardHeader } from "./components/dashboard-header";
export { DashboardSkeleton } from "./components/dashboard-skeleton";

// Dashboard services
export { boardService } from "./services/board.service";

// Dashboard store
export { useBoardStore } from "./store/board.store";
export type {
  BoardFormData,
  CollaboratorFormData,
} from "./validations/schemas";
// Dashboard validations
export { boardSchema, collaboratorSchema } from "./validations/schemas";
