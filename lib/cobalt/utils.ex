defmodule Utils do
  def get_styles(filename) do
    with {:ok, body} <- File.read(filename),
         {:ok, json} <- Jason.decode(body, keys: :atoms),
         do: {:ok, json}
  end
end
