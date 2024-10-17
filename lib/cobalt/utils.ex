defmodule Utils do
  def get_styles(dir) do
    with {:ok, pathname} <- build_styles_json_pathname(dir),
         {:ok, body} <- File.read(pathname),
         {:ok, json} <- Jason.decode(body, keys: :atoms),
         do: {:ok, json}
  end

  def build_styles_json_pathname(dir) do
    case File.ls(dir) do
      {:ok, paths} ->
        postfix = ".module.scss"

        case Enum.find(paths, &String.contains?(&1, postfix)) do
          nil ->
            {:error, :style_json_not_found, {dir}}

          scss ->
            scss = Enum.at(String.split(scss, postfix), 0)
            pathname = Path.join([dir, "#{scss}.styles.json"])

            {:ok, pathname}
        end

      _ ->
        {:error, :couldnt_ls_dir, {dir}}
    end
  end
end
