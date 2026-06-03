import { useMemo, useState } from "react";
import Empty from "../../components/Empty";
import Menus from "../../components/Menus";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import type { AssignmentResultRow, ResultStatus } from "../../types/results";
import GradeResultForm from "./GradeResultForm";
import ResultStatusBadge from "./ResultStatusBadge";
import { useAssignmentResults } from "./useAssignmentResults";

const statusOptions: Array<ResultStatus | "all"> = [
  "all",
  "pending",
  "late",
  "missing",
  "graded",
];

function formatDateTime(value: string | null) {
  if (!value) return "Not submitted";

  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getResultKey(result: AssignmentResultRow) {
  return `${result.assignment_id}-${result.student_id}-${result.result_id ?? "virtual"}`;
}

export default function AssignmentResults({
  assignmentId,
}: {
  assignmentId: number;
}) {
  const { results, isLoading, error } = useAssignmentResults(assignmentId);
  const [statusFilter, setStatusFilter] = useState<ResultStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesStatus =
        statusFilter === "all" || result.status === statusFilter;
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !search ||
        result.student_name.toLowerCase().includes(search) ||
        result.student_email.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [results, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    return results.reduce(
      (total, result) => ({
        ...total,
        [result.status]: total[result.status] + 1,
      }),
      {
        pending: 0,
        late: 0,
        missing: 0,
        graded: 0,
      } satisfies Record<ResultStatus, number>,
    );
  }, [results]);

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 p-5 text-red-200">
        Assignment results could not be loaded.
      </div>
    );
  }

  if (!results.length) return <Empty resourceName="enrolled students" />;

  return (
    <div className="rounded-2xl bg-white/50 p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-300">
            Submissions & Results
          </h2>
          <p className="mt-1 text-brand-300/70">
            {summary.graded} graded · {summary.late} late · {summary.missing}{" "}
            missing · {summary.pending} pending
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search student"
            className="rounded-xl border border-white/30 bg-white/60 px-4 py-2 text-brand-300 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ResultStatus | "all")
            }
            className="rounded-xl border border-white/30 bg-white/60 px-4 py-2 text-brand-300 outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!filteredResults.length ? (
        <Empty resourceName="matching submissions" />
      ) : (
        <Menus>
          <div className="w-full overflow-x-auto rounded-2xl">
            <div className="min-w-300">
              <Table columns="2fr 1.2fr 1.1fr 1fr 1fr 0.8fr">
                <Table.Header>
                  <div>Student</div>
                  <div>Submitted</div>
                  <div>Status</div>
                  <div>Answers</div>
                  <div>Score</div>
                  <div></div>
                </Table.Header>

                <Table.Body
                  data={filteredResults}
                  render={(result) => {
                    const canGrade = Boolean(
                      result.result_id && result.submitted_at,
                    );

                    return (
                      <Table.Row key={getResultKey(result)}>
                        <div>
                          <p className="font-semibold text-brand-300">
                            {result.student_name}
                          </p>
                          <p className="text-sm text-brand-300/60">
                            {result.student_email}
                          </p>
                        </div>

                        <div className="text-brand-300">
                          {formatDateTime(result.submitted_at)}
                        </div>

                        <div>
                          <ResultStatusBadge status={result.status} />
                        </div>

                        <div className="text-brand-300">
                          {result.answers.length}/{result.questions.length}
                        </div>

                        <div className="font-semibold text-brand-300">
                          {result.score ?? "-"} / {result.total_score}
                        </div>

                        <div>
                          <Modal>
                            <Modal.Open opens="grade-result">
                              <button
                                type="button"
                                disabled={!canGrade}
                                className="rounded-xl bg-brand-200 px-4 py-2 font-semibold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                Review / Grade
                              </button>
                            </Modal.Open>

                            <Modal.Window name="grade-result">
                              <GradeResultForm result={result} />
                            </Modal.Window>
                          </Modal>
                        </div>
                      </Table.Row>
                    );
                  }}
                />
              </Table>
            </div>
          </div>
        </Menus>
      )}
    </div>
  );
}
