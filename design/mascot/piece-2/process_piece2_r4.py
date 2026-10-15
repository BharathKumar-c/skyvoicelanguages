from process_piece2_r2 import PIECE, build_round


SOURCE = PIECE / "source" / "skill-signals-r4-imagegen.png"


if __name__ == "__main__":
    build_round(
        "r4",
        SOURCE,
        clean_active_marks=True,
        emphasize_active=False,
        make_silhouette_proof=True,
    )

