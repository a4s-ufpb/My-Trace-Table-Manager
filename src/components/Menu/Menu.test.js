import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Menu from './index.jsx';

const mockSetMenu = jest.fn();

const renderMenu = () => {
    return render(
        <BrowserRouter>
            <div data-testid="outside-area">
                <Menu setMenu={mockSetMenu} />
            </div>
        </BrowserRouter>
    );
};

describe('Componente Menu', () => {

    beforeEach(() => {
        mockSetMenu.mockClear();
        localStorage.clear();
    });

    test('deve renderizar os links padrões para um usuário comum', () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('user');
        renderMenu();

        expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Cadastrar Exercício' })).toBeInTheDocument();

        expect(screen.queryByRole('link', { name: 'Cadastrar/Ver Professor(es)' })).not.toBeInTheDocument();
    });

    test('deve renderizar o link de professor para um usuário admin', () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('admin');
        renderMenu();

        expect(screen.getByRole('link', { name: 'Cadastrar/Ver Professor(es)' })).toBeInTheDocument();
    });

    test('deve chamar setMenu(false) ao clicar em um link', async () => {
        renderMenu();
        const user = userEvent.setup();

        const inicioLink = screen.getByRole('link', { name: 'Início' });
        await user.click(inicioLink);

        expect(mockSetMenu).toHaveBeenCalledWith(false);
        expect(mockSetMenu).toHaveBeenCalledTimes(1);
    });

    test('deve chamar setMenu(false) ao clicar no botão de fechar "X"', async () => {
        renderMenu();
        const user = userEvent.setup();

        const closeButton = screen.getByRole('button', { name: /fechar menu/i });
        await user.click(closeButton);

        expect(mockSetMenu).toHaveBeenCalledWith(false);
        expect(mockSetMenu).toHaveBeenCalledTimes(1);
    });

    test('deve chamar setMenu(false) ao clicar fora do componente', async () => {
        renderMenu();
        const user = userEvent.setup();

        const outsideArea = screen.getByTestId('outside-area');
        await user.click(outsideArea);

        expect(mockSetMenu).toHaveBeenCalledWith(false);
        expect(mockSetMenu).toHaveBeenCalledTimes(1);
    });
});