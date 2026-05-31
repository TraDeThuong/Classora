import { createContext, useContext, type JSX, type ReactNode } from "react";

type TableContextType = {
  columns: string;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

function useTableContext() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Table components must be used inside <Table>");
  }

  return context;
}

type TableProps = {
  columns: string;
  children: ReactNode;
};

type HeaderProps = {
  children: ReactNode;
};

type RowProps = {
  children: ReactNode;
};

type BodyProps<T> = {
  data?: T[];
  render: (item: T) => ReactNode;
};

type CompoundTable = {
    ({ columns, children }: TableProps): JSX.Element;
    Header: ({ children }: HeaderProps) => JSX.Element;
    Row: ({ children }: RowProps) => JSX.Element;
    Body: <T>({ data, render }: BodyProps<T>) => JSX.Element;
    Footer: ({ children }: { children?: ReactNode }) => JSX.Element | null;
};

const Table: CompoundTable = function Table({ columns, children }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div
        role="table"
        className="
          overflow-hidden rounded-[7px] border border-grey-200
          bg-grey-0 text-[1.4rem]
        "
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

function Header({ children }: HeaderProps) {
  const { columns } = useTableContext();

  return (
    <header
      role="row"
      style={{ gridTemplateColumns: columns }}
      className="
        grid items-center gap-x-[2.4rem]
        border-b border-grey-100 bg-grey-50
        px-[2.4rem] py-[1.6rem]
        font-semibold uppercase tracking-[0.4px]
        text-grey-600
      "
    >
      {children}
    </header>
  );
}

function Row({ children }: RowProps) {
  const { columns } = useTableContext();

  return (
    <div
      role="row"
      style={{ gridTemplateColumns: columns }}
      className="
        grid items-center gap-x-[2.4rem]
        border-b border-grey-100
        px-[2.4rem] py-[1.2rem]
        last:border-b-0
      "
    >
      {children}
    </div>
  );
}

function Body<T>({ data = [], render }: BodyProps<T>) {
  if (!data.length) {
    return (
      <p className="m-[2.4rem] text-center text-[1.6rem] font-medium">
        No data to show at the moment
      </p>
    );
  }

  return <section className="my-[0.4rem]">{data.map(render)}</section>;
}

function Footer({ children }: { children?: ReactNode }) {
  if (!children) return null;

  return (
    <footer
      className="
        flex justify-center bg-grey-50 p-[1.2rem]
      "
    >
      {children}
    </footer>
  );
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;