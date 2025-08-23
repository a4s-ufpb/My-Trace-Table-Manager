import { render, screen, fireEvent, within } from '@testing-library/react';
import ListItems from './index';

const mockRemoveItem = jest.fn();
const mockOnEdit = jest.fn();

describe('Componente ListItems', () => {
  const themeItems = [
    { id: 1, name: 'Condicional' },
    { id: 2, name: 'Laço de Repetição' },
  ];

  const professorItems = [
    { id: 1, name: 'Professor A' },
    { id: 2, name: 'Professor B' },
  ];

  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockOnEdit.mockClear();
  });

  test('deve renderizar os itens com seus IDs corretamente', () => {
    render(<ListItems items={themeItems} showId={true} title="Temas" />);

    const item1 = screen.getByTestId('list-item-1');
    expect(within(item1).getByText('Condicional')).toBeInTheDocument();
    expect(within(item1).getByText('1')).toBeInTheDocument();

    const item2 = screen.getByTestId('list-item-2');
    expect(within(item2).getByText('Laço de Repetição')).toBeInTheDocument();
    expect(within(item2).getByText('2')).toBeInTheDocument();
  });

  test('não deve renderizar os IDs quando showId for false', () => {
    render(<ListItems items={professorItems} showId={false} title="Professores" />);
    expect(screen.getByText('Professor A')).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  test('deve chamar onEdit com o item correto ao clicar em editar', () => {
    render(<ListItems items={themeItems} onEdit={mockOnEdit} title="Temas" />);

    const editButton = screen.getByRole('button', { name: /Editar Laço de Repetição/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(themeItems[1]);
  });

  test('deve abrir pop-up com texto de "theme" ao clicar para excluir um tema', () => {
    render(<ListItems items={themeItems} itemType="theme" title="Temas" />);

    const deleteButton = screen.getByRole('button', { name: /Excluir Condicional/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Tem certeza que deseja excluir este tema?/)).toBeVisible();
  });

  test('deve abrir pop-up com texto de "professor" ao clicar para excluir um professor', () => {
    render(<ListItems items={professorItems} itemType="professor" title="Professores" />);

    const deleteButton = screen.getByRole('button', { name: /Excluir Professor A/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Tem certeza que deseja excluir este professor?/)).toBeVisible();
  });

  test('deve chamar removeItem com o ID correto ao confirmar a exclusão', () => {
    render(<ListItems items={themeItems} itemType="theme" removeItem={mockRemoveItem} title="Temas" />);

    const deleteButton = screen.getByRole('button', { name: /Excluir Laço de Repetição/i });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    fireEvent.click(confirmButton);

    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    expect(mockRemoveItem).toHaveBeenCalledWith(2);
  });

  test('deve fechar o pop-up sem remover o item ao clicar em "Cancelar"', () => {
    render(<ListItems items={themeItems} removeItem={mockRemoveItem} title="Temas" />);

    const deleteButton = screen.getByRole('button', { name: /Excluir Condicional/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Tem certeza que deseja excluir/)).toBeVisible();

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/Tem certeza que deseja excluir/)).toBeNull();
    expect(mockRemoveItem).not.toHaveBeenCalled();
  });

  test('não deve renderizar nenhum item da lista quando a prop "items" estiver vazia', () => {
    render(<ListItems items={[]} title="Temas" />);

    const qualquerItemDaLista = screen.queryByTestId(/list-item-/);

    expect(qualquerItemDaLista).toBeNull();
  });

  test('deve aplicar a classe de edição ao item correto', () => {
    render(<ListItems items={themeItems} editingId={2} title="Temas" />);

    const itemEmEdicao = screen.getByTestId('list-item-2');
    expect(itemEmEdicao).toHaveClass('itemEditing');

    const outroItem = screen.getByTestId('list-item-1');
    expect(outroItem).not.toHaveClass('itemEditing');
  });
});