// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract RegistroDeProduto {
    string private produtoRegistrado;

    event ProdutoRegistrado(address autor, string nomeDoProduto);

    function registrarProduto(string memory nomeDoProduto) public {
        require(bytes(nomeDoProduto).length > 0, "Produto vazio");

        produtoRegistrado = nomeDoProduto;

        emit ProdutoRegistrado(msg.sender, nomeDoProduto);
    }

    function lerProdutoRegistrado() public view returns (string memory) {
        return produtoRegistrado;
    }
}
